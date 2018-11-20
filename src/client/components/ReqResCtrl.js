import * as store from '../store';
import * as actions from '../actions/actions';

const ReqResCtrl = {
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

  // logSelected(id) {
  //   const gotState = store.default.getState();
  //   const reqResArr = gotState.business.reqResArray;
  //   let reqResObj = reqResArr.find((el) => el.id == id);

  //   if (!reqResObj.checkSelected) {
  //     reqResObj.checkSelected = true;
  //     store.default.dispatch(actions.reqResUpdate(reqResObj));
  //     this.selectedArray.push(Number(id));
  //   } else if (reqResObj.checkSelected) {
  //     reqResObj.checkSelected = false;
  //     store.default.dispatch(actions.reqResUpdate(reqResObj));
  //     this.selectedArray = this.selectedArray.filter(item => item !== id);
  //     reqResObj.checkSelected = !reqResObj.checkSelected;
  //   }
  // },

  /* Iterates across REQ/RES Array and opens connections for each object and passes each object to fetchController */

  openReqRes(id) {
    console.log(id);
    const openConnectionObj = {
      abort : new AbortController(),
      id: id,
    }

    const reqResArr = store.default.getState().business.reqResArray;

    // Search the store for the passed in ID
    const reqResObj = reqResArr.find((el) => el.id == id);
    
    //clear the existing events
    reqResObj.response.headers = {};
    reqResObj.response.events = [];
    store.default.dispatch(actions.reqResUpdate(reqResObj));

    this.openConnectionArray.push(openConnectionObj);
    this.parseReqObject (reqResObj, openConnectionObj.abort);
  },

  openAllSelectedReqRes() {
    ReqResCtrl.closeAllReqRes();

    const reqResArr = store.default.getState().business.reqResArray;
    
    reqResArr.forEach(reqRes => {
      if(reqRes.checked) {
        ReqResCtrl.openReqRes(reqRes.id);
      }
    });

    // reqResArr.forEach(reqResObj => {
    //   const reqResId = reqResObj.id;
    //   if (this.selectedArray.includes(reqResId)) {
    //     this.openReqRes(reqResId);
    //   }
    // })
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

    if (foundAbortController) {
      foundAbortController.abort.abort();
    }
    
    this.openConnectionArray = this.openConnectionArray.filter(obj => obj.id !== id);
  },

  /* Closes all open endpoint */
  closeAllReqRes() {
    const reqResArr = store.default.getState().business.reqResArray;

    reqResArr.forEach(reqRes => {
      if (reqRes.checked) {
        ReqResCtrl.closeReqRes(reqRes.id);

        // let matchedAbortObject = ReqResCtrl.openConnectionArray.find(connObj => connObj.id === reqRes.id);

        // if (matchedAbortObject) {
        //   matchedAbortObject.abort.abort();
        //   ReqResCtrl.setReqResConnectionToClosed(reqRes.id);

        //   ReqResCtrl.openConnectionArray = ReqResCtrl.openConnectionArray.filter(obj => obj.id !== reqRes.id);
        // }
      }
    });

    // this.openConnectionArray.forEach(abortObject => {
    //   if (this.selectedArray.includes(abortObject.id)) {
    //     this.selectedArray.forEach(abortId => {
    //       if (abortObject.id == abortId) {
    //         abortObject.abort.abort();
    //         const openConnectionObj = {
    //           abort : new AbortController(),
    //         }
    //         this.closeConnection(abortId)
    //       }
    //     })
    //   }
    // });
  },

  clearAllReqRes() {
    // const reqResArr = store.default.getState().business.reqResArray;
    ReqResCtrl.closeAllReqRes();
    store.default.dispatch(actions.reqResClear());


    // reqResArr.forEach((el) => {
    //   if (el.id == e.target.id) {
    //     el.connection = 'closed';
    //     store.default.dispatch(actions.reqResUpdate(el));
    //   }
    // });
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
          read();
        }
      });
    }
  }
};


export default ReqResCtrl;
