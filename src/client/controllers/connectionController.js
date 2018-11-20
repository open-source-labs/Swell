import * as store from '../store';
import * as actions from '../actions/actions';
import httpController from './httpController.js'

const connectionController = {
  openConnectionArray:[],
  // selectedArray:[],

  selectAllResReq() {
    const reqResArr = store.default.getState().business.reqResArray;

    reqResArr.forEach(resReq => {
      if (!resReq.checked) {
        resReq.checked = true;
        store.default.dispatch(actions.reqResUpdate(resReq));
      }
    })
  },

  deselectAllResReq() {
    const reqResArr = store.default.getState().business.reqResArray;

    reqResArr.forEach(resReq => {
      if (resReq.checked) {
        resReq.checked = false;
        store.default.dispatch(actions.reqResUpdate(resReq));
      }
    })
  },

  openReqRes(id) {
    const reqResArr = store.default.getState().business.reqResArray;
    const reqResObj = reqResArr.find((el) => el.id == id);

    let connectionObject = reqResObj.protocol === 'ws://' ? wsControl() : httpController.openHTTPconnection(reqResObj);

    console.log(connectionObject);

    this.openConnectionArray.push(connectionObject);
  },

  openAllSelectedReqRes() {
    connectionController.closeAllReqRes();

    const reqResArr = store.default.getState().business.reqResArray;
    
    reqResArr.forEach(reqRes => {
      if(reqRes.checked) {
        connectionController.openReqRes(reqRes.id);
      }
    });
  },

  setReqResConnectionToClosed(id) {
    const reqResArr = store.default.getState().business.reqResArray;

    let foundReqRes = reqResArr.find(reqRes => reqRes.id == id);
    foundReqRes.connection = 'closed';
    store.default.dispatch(actions.reqResUpdate(foundReqRes));

  },

  closeReqRes(id) {
    this.setReqResConnectionToClosed(id);
    let foundAbortController = this.openConnectionArray.find(obj => obj.id = id);
    console.log(foundAbortController);
    if (foundAbortController) {
      foundAbortController.abort.abort();
      console.log('aborted');
    }
    
    this.openConnectionArray = this.openConnectionArray.filter(obj => obj.id !== id);
  },

  /* Closes all open endpoint */
  closeAllReqRes() {
    const reqResArr = store.default.getState().business.reqResArray;

    reqResArr.forEach(reqRes => {
      if (reqRes.checked) {
        connectionController.closeReqRes(reqRes.id);
      }
    });
  },

  clearAllReqRes() {
    connectionController.closeAllReqRes();
    store.default.dispatch(actions.reqResClear());
  },

  parseReqObject(object, abortController) {
    let { url, request: { method }, request: { headers }, request: { body } } = object;

    method = method.toUpperCase();
    
    let formattedHeaders = {};
    headers.forEach(head => {
      formattedHeaders[head.key] = head.value
    })

    // formattedHeaders["Access-Control-Allow-Origin"] = '*';

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

    this.fetchController(outputObj, url, object, abortController)
  },

  /* Utility function to open fetches */
  fetchController(parsedObj, url, originalObj, abortController) {
    let timeSentSnap = Date.now();

    const newObj = JSON.parse(JSON.stringify(originalObj));
    newObj.connection = 'pending';
    store.default.dispatch(actions.reqResUpdate(newObj));

    const signal = abortController.signal;

    parsedObj.signal = signal; 

    return fetch(url, parsedObj)
    .then(response => {
      let heads = {};

      for (let entry of response.headers.entries()) {
        heads[entry[0].toLowerCase()] = entry[1];
      }

      const contentType = heads['content-type'];
      const isStream = contentType.includes('stream');

      isStream ? this.handleSSE(response, originalObj, timeSentSnap, heads) : this.handleSingleEvent(response.json(), originalObj, timeSentSnap, heads);
    })
    .catch(err => console.log(err))
  },

  handleSingleEvent(response, originalObj, timeSentSnap, headers) {
    console.log('Handling Single Event')

    const newObj = JSON.parse(JSON.stringify(originalObj));

    response.then((res) => {
      newObj.connection = 'closed';
      newObj.connectionType = 'plain';
      newObj.timeSent = timeSentSnap;
      newObj.timeReceived = Date.now();
      newObj.response = {
        headers: headers,
        events: [],
      };

      newObj.response.events.push({
        data: res,
        timeReceived: Date.now(),
      });
      store.default.dispatch(actions.reqResUpdate(newObj));
    })
  },

  /* handle SSE Streams */
  handleSSE(response, originalObj, timeSentSnap, headers) {
    let reader = response.body.getReader();

    read();

    const newObj = JSON.parse(JSON.stringify(originalObj));

    newObj.timeSent = timeSentSnap;
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

export default connectionController;
