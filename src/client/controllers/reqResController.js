import * as store from '../store';
import * as actions from '../actions/actions';
import graphQLController from './graphQLController.js';

const { api } = window;
const connectionController = {
  openConnectionArray: [],

  // toggles checked in state for entire reqResArray
  toggleSelectAll() {
    const { reqResArray } = store.default.getState().business;

    if (reqResArray.every((obj) => obj.checked === true)) {
      reqResArray.forEach((obj) => (obj.checked = false));
    } else {
      reqResArray.forEach((obj) => (obj.checked = true));
    }
    store.default.dispatch(actions.setChecksAndMinis(reqResArray));
  },

  // listens for reqResUpdate event from main process telling it to update reqResObj REST EVENTS
  openReqRes(id) {
    // remove all previous listeners for 'reqResUpdate' before starting to listen for 'reqResUpdate' again
    api.removeAllListeners('reqResUpdate');
    api.receive('reqResUpdate', (reqResObj) => {
      if (
        (reqResObj.connection === 'closed' ||
          reqResObj.connection === 'error') &&
        reqResObj.timeSent &&
        reqResObj.timeReceived &&
        reqResObj.response.events.length > 0
      ) {
        store.default.dispatch(actions.updateGraph(reqResObj));
      }
      store.default.dispatch(actions.reqResUpdate(reqResObj));
      // If current selected response equals reqResObj received, update current response
      const currentID = store.default.getState().business.currentResponse.id;
      if (currentID === reqResObj.id) {
        store.default.dispatch(
          actions.saveCurrentResponseData(reqResObj, 'currentID===reqresObj.id')
        );
      }
    });
    // Since only obj ID is passed in, next two lines get the current array of request objects and finds the one with matching ID
    const reqResArr = store.default.getState().business.reqResArray;
    const reqResObj = reqResArr.find((el) => el.id === id);
    if (reqResObj.request.method === 'SUBSCRIPTION')
      graphQLController.openSubscription(reqResObj);
    else if (reqResObj.graphQL) {
      graphQLController.openGraphQLConnection(reqResObj);
    } else if (/wss?:\/\//.test(reqResObj.protocol) && !reqResObj.webrtc) {
      // create context bridge to wsController in node process to open connection, send the reqResObj and connection array
      api.send('open-ws', reqResObj, this.openConnectionArray);

      // update the connectionArray when connection is open from ws
      api.receive('update-connectionArray', (connectionArray) => {
        this.openConnectionArray.push(...connectionArray);
      });
      // Todo: WEBRTC
    } else if (reqResObj.webrtc) {
      console.log(reqResObj);
    }
    // gRPC connection
    else if (reqResObj.gRPC) {
      api.send('open-grpc', reqResObj);
      // Standard HTTP?
    } else if (reqResObj.openapi) {
      console.log('got an open api request to fill');
      console.log(reqResObj);
    } else {
      api.send('open-http', reqResObj, this.openConnectionArray);
    }
  },

  openScheduledReqRes(id) {
    // listens for reqResUpdate event from main process telling it to update reqResObj
    // REST EVENTS
    api.removeAllListeners('reqResUpdate');
    api.receive('reqResUpdate', (reqResObj) => {
      if (
        (reqResObj.connection === 'closed' ||
          reqResObj.connection === 'error') &&
        reqResObj.timeSent &&
        reqResObj.timeReceived &&
        reqResObj.response.events.length > 0
      ) {
        store.default.dispatch(actions.updateGraph(reqResObj));
      }
      store.default.dispatch(actions.scheduledReqResUpdate(reqResObj));
    });
    // Since only obj ID is passed in, next two lines get the current array of request objects and finds the one with matching ID
    const reqResArr = store.default.getState().business.reqResArray;
    const reqResObj = reqResArr.find((el) => el.id === id);
    if (reqResObj.request.method === 'SUBSCRIPTION')
      graphQLController.openSubscription(reqResObj);
    else if (reqResObj.graphQL) {
      graphQLController.openGraphQLConnection(reqResObj);
    } else if (/wss?:\/\//.test(reqResObj.protocol)) {
      // create context bridge to wsController in node process to open connection, send the reqResObj and connection array
      api.send('open-ws', reqResObj, this.openConnectionArray);

      // update the connectionArray when connection is open from ws
      api.receive('update-connectionArray', (connectionArray) => {
        this.openConnectionArray.push(...connectionArray);
      });
    }
    // gRPC connection
    else if (reqResObj.gRPC) {
      api.send('open-grpc', reqResObj);
      // Standard HTTP?
    } else {
      api.send('open-http', reqResObj, this.openConnectionArray);
    }
  },

  runCollectionTest(reqResArray) {
    api.removeAllListeners('reqResUpdate');
    let index = 0;
    api.receive('reqResUpdate', (reqResObj) => {
      if (
        (reqResObj.connection === 'closed' ||
          reqResObj.connection === 'error') &&
        reqResObj.timeSent &&
        reqResObj.timeReceived &&
        reqResObj.respcodonse.events.length > 0
      ) {
        store.default.dispatch(actions.updateGraph(reqResObj));
      }
      store.default.dispatch(actions.reqResUpdate(reqResObj));

      store.default.dispatch(
        actions.saveCurrentResponseData(reqResObj, 'api.receive reqresupdate')
      );
      if (index < reqResArray.length) {
        runSingletest(reqResArray[index]);
        index += 1;
      }
    });
    const reqResObj = reqResArray[index];

    function runSingletest(reqResObj) {
      if (reqResObj.request.method === 'SUBSCRIPTION')
        graphQLController.openSubscription(reqResObj);
      else if (reqResObj.graphQL) {
        graphQLController.openGraphQLConnectionAndRunCollection(reqResArray);
      } else if (/wss?:\/\//.test(reqResObj.protocol)) {
        // create context bridge to wsController in node process to open connection, send the reqResObj and connection array
        api.send('open-ws', reqResObj);

        // update the connectionArray when connection is open from ws
        api.receive('update-connectionArray', (connectionArray) => {
          this.openConnectionArray.push(...connectionArray);
        });
      }
      // gRPC connection
      else if (reqResObj.gRPC) {
        api.send('open-grpc', reqResObj);
        // Standard HTTP?
      } else {
        api.send('open-http', reqResObj);
      }
    }
    runSingletest(reqResObj);
    index += 1;
  },

  openAllSelectedReqRes() {
    connectionController.closeAllReqRes();

    const { reqResArray } = store.default.getState().business;

    reqResArray.forEach((reqRes) => connectionController.openReqRes(reqRes.id));
  },

  getConnectionObject(id) {
    return this.openConnectionArray.find((obj) => (obj.id = id));
  },

  setReqResConnectionToClosed(id) {
    const reqResArr = store.default.getState().business.reqResArray;

    const foundReqRes = JSON.parse(
      JSON.stringify(reqResArr.find((reqRes) => reqRes.id === id))
    );

    foundReqRes.connection = 'closed';
    store.default.dispatch(actions.reqResUpdate(foundReqRes));
    store.default.dispatch(
      actions.saveCurrentResponseData(
        foundReqRes,
        'foundreqres.connection closed'
      )
    );
  },

  closeReqRes(reqResObj) {
    if (reqResObj.protocol.includes('http')) {
      api.send('close-http', reqResObj);
    }

    const { id } = reqResObj;
    this.setReqResConnectionToClosed(id);

    // WS is the only protocol using openConnectionArray
    const foundAbortController = this.openConnectionArray.find(
      (obj) => obj.id === id
    );
    if (foundAbortController && foundAbortController.protocol === 'WS') {
      api.send('close-ws');
    }
    this.openConnectionArray = this.openConnectionArray.filter(
      (obj) => obj.id !== id
    );
  },

  /* Closes all open endpoint */
  closeAllReqRes() {
    const { reqResArray } = store.default.getState().business;
    reqResArray.forEach((reqRes) => connectionController.closeReqRes(reqRes));
  },

  clearAllReqRes() {
    connectionController.closeAllReqRes();
    store.default.dispatch(actions.reqResClear());
  },

  // toggles minimized in ReqRes array in state
  toggleMinimizeAll() {
    const { reqResArray } = store.default.getState().business;

    if (reqResArray.every((obj) => obj.minimized === true)) {
      reqResArray.forEach((obj) => (obj.minimized = false));
    } else {
      reqResArray.forEach((obj) => (obj.minimized = true));
    }
    store.default.dispatch(actions.setChecksAndMinis(reqResArray));
  },
  // clears a dataPoint from state
  clearGraph() {
    store.default.dispatch(actions.clearGraph());
  },
  // clears ALL data points from state
  clearAllGraph() {
    store.default.dispatch(actions.clearAllGraph());
  },
};

export default connectionController;
