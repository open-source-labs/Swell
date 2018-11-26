import * as store from '../store';
import * as actions from '../actions/actions';
const http2 = require('http2');


const httpController = {
  openHTTP2Connections : [],

  openHTTPconnection(reqResObj, connectionArray) {
    /*
     * TRY TO CONNECT AS HTTP2 FIRST IF HTTPS. If error, fallback to HTTP1.1 (WebAPI fetch)
    */
    if(reqResObj.protocol === 'https://') {
      console.log('HTTPS, TRYING HTTP2');
      httpController.establishHTTP2Connection(reqResObj, connectionArray);
    } 
    else {
      console.log('HTTP REQUEST, MOVING TO FETCH');
      httpController.establishHTTP1connection(reqResObj, connectionArray);
    }
  },

  establishHTTP2Connection(reqResObj, connectionArray) {
    /*
      Attempt to find an existing HTTP2 connection in openHTTP2Connections Array.
      If exists, use connection to initiate request
      If not, create connection, push to array, and then initiate request
    */

    let foundHTTP2Connection = httpController.openHTTP2Connections.find(conn => conn.host === reqResObj.host);

    //existing HTTP2 connection is found, attach a request to it.
    if (foundHTTP2Connection) {
      const client = foundHTTP2Connection.client;

      //periodically check if the client is open or destroyed, and attach if conditions are met
      let interval = setInterval(() => {
        if(foundHTTP2Connection.status === 'connected') {
          console.log('Existing HTTP2 Conn:', reqResObj.host);
          this.attachRequestToHTTP2Client(client, reqResObj, connectionArray);
          clearInterval(interval);
        }
        //if failed, could because of protocol error. try HTTP1
        else if (foundHTTP2Connection.status === 'failed') {
          httpController.establishHTTP1connection(reqResObj, connectionArray);
          clearInterval(interval);
        }
      }, 50); 
      //if hasnt changed in 10 seconds, mark as error
      setTimeout(() => {
        clearInterval(interval);
        if (foundHTTP2Connection.status === 'initialized') {
          reqResObj.connection = 'error';
          store.default.dispatch(actions.reqResUpdate(reqResObj));
        }
      }, 10000);
    } 

    //no existing HTTP2 connection, make it before attaching request.
    else {
      console.log('New HTTP2 Conn:', reqResObj.host);

      let id = Math.random() * 100000;
      const client = http2.connect(reqResObj.host);

      //push HTTP2 connection to array
      let http2Connection = {
        client : client,
        id : id,
        host : reqResObj.host,
        status : 'initialized',
      };
      httpController.openHTTP2Connections.push(http2Connection);

      client.on('error', (err) => {
        console.error('HTTP2 FAILED...trying HTTP1\n',err);
        http2Connection.status = 'failed';
        client.destroy();
  
        //if it exists in the openHTTP2Connections array, remove it
        httpController.openHTTP2Connections = httpController.openHTTP2Connections.filter(conn => conn.id !== id);
  
        //need to filter connectionArray for existing connObj as a nonfunctioning one may have been pushed in establishHTTP2connection...can't actually use filter though due to object renaming
        connectionArray.forEach((obj, i) => {
          if (obj.id === reqResObj.id) {
            connectionArray.splice(i, 1);
          }
        });
      
        //try again with fetch (HTTP1);
        httpController.establishHTTP1connection(reqResObj, connectionArray);
      });

      client.on('connect', () => {
        http2Connection.status = 'connected';

        //attach request
        this.attachRequestToHTTP2Client(client, reqResObj, connectionArray);
      });
    } 
  },

  attachRequestToHTTP2Client (client, reqResObj, connectionArray) {
    //start off by clearing existing response data
    reqResObj.response.headers = {};
    reqResObj.response.events = [];
    reqResObj.connection = 'pending';
    reqResObj.timeSent = Date.now();
    store.default.dispatch(actions.reqResUpdate(reqResObj));

    let formattedHeaders = {};
    reqResObj.request.headers.forEach(head => {
      formattedHeaders[head.key] = head.value
    });
    formattedHeaders[':path'] = reqResObj.path;

    //initiate request
    const reqStream = client.request(formattedHeaders, { endStream : false });
    //endStream false means we can continue to send more data, which we would for a body;

    //Send body depending on method;
    if (reqResObj.request.method !== 'GET' && reqResObj.request.method !== 'HEAD') {
      reqStream.end(reqResObj.request.body);
    } else {
      reqStream.end();
    }

    const openConnectionObj = {
      stream : reqStream,
      protocol : 'HTTP2',
      id : reqResObj.id,
    };
    connectionArray.push(openConnectionObj);

    let isSSE;
    reqStream.on('response', (headers, flags) => {
      isSSE = headers['content-type'].includes('stream');

      if (isSSE) {
        reqResObj.connection = 'open';
        reqResObj.connectionType = 'SSE';
      } else {
        reqResObj.connection = 'closed';
        reqResObj.connectionType = 'plain';
      }
      
      reqResObj.isHTTP2 = true;
      reqResObj.timeReceived = Date.now();
      reqResObj.response = {
        headers: headers,
        events: [],
      };
      store.default.dispatch(actions.reqResUpdate(reqResObj));
    });
    
    reqStream.setEncoding('utf8');
    let data = '';
    reqStream.on('data', (chunk) => { 
      if (isSSE) {
        if(chunk === '\n\n') {
          let receivedEventFields = this.parseSSEFields(data);
          receivedEventFields.timeReceived = Date.now();

          reqResObj.response.events.push(receivedEventFields);
          store.default.dispatch(actions.reqResUpdate(reqResObj));

          data = '';
        } else {
          data = data + chunk;
        }
      } else {
        data += chunk;
      }
    });
    reqStream.on('end', () => {
      if(isSSE) {
        let receivedEventFields = this.parseSSEFields(data);
        receivedEventFields.timeReceived = Date.now();
        reqResObj.connection = 'closed';
        reqResObj.response.events.push(receivedEventFields);
        store.default.dispatch(actions.reqResUpdate(reqResObj));
      } else {
        reqResObj.connection = 'closed';
        reqResObj.response.events.push(data);
        store.default.dispatch(actions.reqResUpdate(reqResObj));
      }
    });
  },

  establishHTTP1connection(reqResObj, connectionArray) {
    //start off by clearing existing response data
    reqResObj.response.headers = {};
    reqResObj.response.events = [];
    reqResObj.connection = 'pending';
    reqResObj.timeSent = Date.now();
    store.default.dispatch(actions.reqResUpdate(reqResObj));

    connectionArray.forEach((obj, i) => {
      if (obj.id === reqResObj.id) {
        connectionArray.splice(i, 1);
      }
    });
    const openConnectionObj = {
      abort : new AbortController(),
      protocol : 'HTTP1',
      id: reqResObj.id,
    }
    connectionArray.push(openConnectionObj);
    // console.log(connectionArray);

    let parsedFetchOptions = this.parseFetchOptionsFromReqRes(reqResObj);
    parsedFetchOptions.signal = openConnectionObj.abort.signal;

    fetch(reqResObj.url, parsedFetchOptions)
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
  },

  parseFetchOptionsFromReqRes (reqResObject) {
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
    // console.log('Handling Single Event')

    const newObj = JSON.parse(JSON.stringify(originalObj));

    let reader = response.body.getReader();
    let bodyContent = "";
    read();

    function read() {
      reader.read().then(obj => {
        // console.log(obj)
        if (obj.done) {
          newObj.connection = 'closed';
          newObj.connectionType = 'plain';
          newObj.timeReceived = Date.now();
          newObj.response = {
            headers: headers,
            events: [],
          };
          // console.log('after', bodyContent)
          newObj.response.events.push(bodyContent);
          store.default.dispatch(actions.reqResUpdate(newObj));
          return;
        } 

        //decode and recursively call
        else {
          bodyContent += new TextDecoder("utf-8").decode(obj.value);
          // console.log(bodyContent);

          read();
        }
      });
    }
  },

  /* handle SSE Streams for HTTP1.1 */
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
          let receivedEventFields = httpController.parseSSEFields(new TextDecoder("utf-8").decode(obj.value));
          receivedEventFields.timeReceived = Date.now();
          
          newObj.response.events.push(receivedEventFields);
          store.default.dispatch(actions.reqResUpdate(newObj));

          //recursive call
          read();
        }
      });
    }
  },

  parseSSEFields(rawString) {
    return rawString
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
  }
};

export default httpController;