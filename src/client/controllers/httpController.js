import * as store from '../store';
import * as actions from '../actions/actions';
const http2 = require('http2');


const httpController = {
  openHTTPconnection(reqResObj) {
    //start off by clearing existing response data
    reqResObj.response.headers = {};
    reqResObj.response.events = [];
    reqResObj.connection = 'pending';
    reqResObj.timeSent = Date.now();
    store.default.dispatch(actions.reqResUpdate(reqResObj));

    const openConnectionObj = {
      abort : new AbortController(),
      protocol : 'HTTP',
      id: reqResObj.id,
    }

    let parsedObj = this.parseHTTPObjectFromReqRes(reqResObj);
    parsedObj.signal = openConnectionObj.abort.signal;

    fetch(reqResObj.url, parsedObj)
    .then(response => {

      //Parse response headers now to decide if SSE or not.
      let heads = {};
      for (let entry of response.headers.entries()) {
        heads[entry[0].toLowerCase()] = entry[1];
      }

      const isStream = heads['content-type'].includes('stream');

      isStream ? this.handleSSE(response, reqResObj, heads) : this.handleSingleEvent(response, reqResObj, heads);
    })
    .catch(err => {
      reqResObj.connection = 'error';
      store.default.dispatch(actions.reqResUpdate(reqResObj));
    })

    return openConnectionObj;
  },


  parseHTTPObjectFromReqRes (reqResObject) {
    let { request: { method }, request: { headers }, request: { body } } = reqResObject;

    method = method.toUpperCase();
    
    let formattedHeaders = {};
    headers.forEach(head => {
      formattedHeaders[head.key] = head.value
    })

    let outputObj = {
      method: method,
      mode: "cors", // no-cors, cors, *same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: formattedHeaders,
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer", // no-referrer, *client
    };

    if (method !== 'GET' && method !== 'HEAD') {
      outputObj.body = body;
    }

    return outputObj;
  },

  handleSingleEvent(response, originalObj, headers) {
    console.log('Handling Single Event')

    const newObj = JSON.parse(JSON.stringify(originalObj));

    let reader = response.body.getReader();
    let bodyContent = "";
    read();

    function read() {
      reader.read().then(obj => {
        console.log(obj)
        if (obj.done) {
          newObj.connection = 'closed';
          newObj.connectionType = 'plain';
          newObj.timeReceived = Date.now();
          newObj.response = {
            headers: headers,
            events: [],
          };
          console.log('after', bodyContent)
          newObj.response.events.push({
            data: bodyContent,
            timeReceived: Date.now(),
          });
          store.default.dispatch(actions.reqResUpdate(newObj));
          return;
        } 

        //decode and recursively call
        else {
          bodyContent += new TextDecoder("utf-8").decode(obj.value);
          console.log(bodyContent);

          read();
        }
      });
    }
  },

  /* handle SSE Streams */
  handleSSE(response, originalObj, headers) {
    let reader = response.body.getReader();

    read();

    const newObj = JSON.parse(JSON.stringify(originalObj));

    newObj.timeReceived = Date.now();
    newObj.response = {
      headers,
      events: [],
    };

    newObj.connection = 'open';
    newObj.connectionType = 'SSE';

    function read() {
      reader.read().then(obj => {

        //base case
        if (obj.done) {
          return;
        } 

        //decode and recursively call
        else {
          let receivedEventFields = new TextDecoder("utf-8").decode(obj.value)
          //since the string is multi line, each for a different field, split by line
          .split('\n')
          //remove empty lines
          .filter(field => field != '')
          //massage fields so they can be parsed into JSON
          .map(field => {
            let fieldColonSplit = field
            .replace(/:/,'&&&&')
            .split('&&&&')
            .map(kv => kv.trim());

            let fieldObj = {
              [fieldColonSplit[0]] : fieldColonSplit[1],
            }
            return fieldObj;
          })
          .reduce((acc, cur) => {
            //handles if there are multiple fields of the same type, for example two data fields.
            let key = Object.keys(cur)[0];
            if (acc[key]) {
              acc[key] = acc[key] + '\n' + cur[key];
            } else {
              acc[key] = cur[key];
            }
            return acc;
          },{})
          receivedEventFields.timeReceived = Date.now();
          
          newObj.response.events.push(receivedEventFields);
          store.default.dispatch(actions.reqResUpdate(newObj));

          //recursive call
          read();
        }
      });
    }
  }
};

export default httpController;