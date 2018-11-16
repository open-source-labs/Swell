import { connect } from 'react-redux';
import * as store from '../store';
import * as actions from '../actions/actions';

const ReqResCtrl = {
  parseReqObject(object, abortController) {
    let { url, request: { method }, request: { headers }, request: { body } } = object;

    console.log(headers);

    method = method.toUpperCase();
    let formattedHeaders = {};
    headers.forEach(head => {
      formattedHeaders[head.key] = head.value
    })

    // formattedHeaders["Access-Control-Allow-Origin"] = '*';

    console.log(formattedHeaders);

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
    // const controller = new AbortController();
    const signal = abortController.signal;

    parsedObj.signal = signal; 

    return fetch(url, parsedObj)
    .then(response => {
      let heads = {};
      for (let entry of response.headers.entries()) {
        heads[entry[0].toLowerCase()] = entry[1];
      }
      console.log(response.body instanceof ReadableStream);
      const isStream = response.body instanceof ReadableStream;

      isStream ? this.handleSSE(response, originalObj, timeSentSnap) : this.handleSingleEvent(response, originalObj, timeSentSnap)
    })
  },

  handleSingleEvent(response, originalObj, timeSentSnap) {
    console.log('Single Event')

    const newObj = JSON.parse(JSON.stringify(originalObj));

    newObj.connection = 'closed';
    newObj.connectionType = 'plain'
    newObj.timeSent = timeSentSnap;
    newObj.timeReceived = Date.now();
    newObj.response = {
      headers: [response.headers],
      events: [response.body],
    };

    store.default.dispatch(actions.reqResUpdate(newObj));
  },

  /* handle SSE Streams */
  handleSSE(response, originalObj, timeSentSnap) {
    let reader = response.body.getReader();
    console.log('Handling Readable Stream');
    console.log('response', response);

    read();

    const newObj = JSON.parse(JSON.stringify(originalObj));

    newObj.timeSent = timeSentSnap;
    newObj.timeReceived = Date.now();
    newObj.response = {
      headers: [response.headers],
      events: [],
    };

    newObj.connection = 'open';
    newObj.connectionType = 'SSE';

    function read() {
      reader.read().then(obj => {
        if (obj.done) {
          return;
        } else {
          let string = new TextDecoder("utf-8").decode(obj.value);
          newObj.response.events.push({
            data: string,
            timeReceived: Date.now()
          });
          store.default.dispatch(actions.reqResUpdate(newObj));
          read();
        }
      });
    }
  },

  toggleEndPoint(e) {
    console.log('log')
  },

  /* Creates a REQ/RES Obj based on event data and passes the object to fetchController */
  openEndPoint(e, abortController) {
    const reqResComponentID = e.target.id;
    const gotState = store.default.getState();
    const reqResArr = gotState.business.reqResArray;

    // Search the store for the passed in ID
    const reqResObj = reqResArr.find((el) => el.id == reqResComponentID);

    ReqResCtrl.parseReqObject(reqResObj, abortController);
  },

  /* Iterates across REQ/RES Array and opens connections for each object and passes each object to fetchController */
  openEndPoints(e) {
    for (let resReqObj of resReqArr) {
      fetchController(resReqArr[e.id].endPoint, resReqArr[e.id].method, resReqArr[e.id].serverType);
    }
  },

  /* Closes open endpoint */
  closeEndpoint(e) {
    console.log('closeEndpoint', e.target);
    const reqResComponentID = e.target.id;
    const gotState = store.default.getState();
    const reqResArr = gotState.business.reqResArray;

    reqResArr[e.target.id].close();
  },

  /* Closes all open endpoint */
  closeEndpoints(resReqArr, e) {
    for (let resReqObj of resReqArr) {
      closeEndpoint(resReqObj);
    }
  }
};



export default ReqResCtrl;
