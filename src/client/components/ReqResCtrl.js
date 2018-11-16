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

    console.log(signal);

    parsedObj.signal = signal; 

    // const abortBtn = document.getElementById(`${originalObj.id}close`);

    // abortBtn.addEventListener('click', function() {
    //   controller.abort();
    //   console.log('Download aborted');
    // });

    return fetch(url, parsedObj)
    .then(response => {
      let heads = {};
      for (let entry of response.headers.entries()) {
        heads[entry[0].toLowerCase()] = entry[1];
      }

      const contentType = heads['content-type'];

      switch (contentType) {
        case 'text/event-stream' :
          console.log('text/event-stream');
          this.handleSSE(response, originalObj, timeSentSnap);
          break;

        case 'text/event-stream; charset=UTF-8' :
          console.log('text/event-stream');
          this.handleSSE(response, originalObj, timeSentSnap);
          break;

        case 'text/plain' :
          console.log('text/plain');
          this.handleSingleEvent();
          break;

        case 'application/json' :
          console.log('application/json');
          this.handleSSE(response, originalObj, timeSentSnap);
          break;

        case 'application/javascript' :
          console.log('application/javascript');
          this.handleSingleEvent();
          break;

        case 'application/xml' :
          console.log('application/xml');
          this.handleSingleEvent();
          break;

        case 'text/xml' :
          console.log('text/xml');
          this.handleSingleEvent();
          break;

        case 'text/html' :
          console.log('text/html');
          this.handleSingleEvent();
          break;

        default :
          console.log('content-type not recognized')
      }
    })
    .catch(err => console.log(err))
  },

  handleSingleEvent() {
    console.log('Single Event')
  },

  /* handle SSE Streams */
  handleSSE(response, originalObj, timeSentSnap) {
    let reader = response.body.getReader();
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
        // console.log(obj);
        if (obj.done) {
          // console.log('finished');
          return;
        } else {
          let string = new TextDecoder("utf-8").decode(obj.value);
          newObj.response.events.push({
            data: string,
            timeReceived: Date.now()
          });
          // console.log(string);
          store.default.dispatch(actions.reqResUpdate(newObj));
          read();
        }
      });
    }
  },
  
  /* Creates a REQ/RES Obj based on event data and passes the object to fetchController */
  toggleOpenEndPoint(e, abortController) {
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

  /* Closes all open endpoint */
  closeEndpoints(resReqArr, e) {
    for (let resReqObj of resReqArr) {
      closeEndpoint(resReqObj);
    }
  }
};



export default ReqResCtrl;
