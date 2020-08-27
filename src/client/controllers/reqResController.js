import * as store from "../store";
import * as actions from "../actions/actions";
import wsController from "./wsController.js";
import graphQLController from "./graphQLController.js";

const { api } = window;
const connectionController = {
  openConnectionArray: [],

  getReqRes_CurrentTabAndSelected() {
    const { reqResArray } = store.default.getState().business;

    const { currentTab } = store.default.getState().business;

    return reqResArray.filter(
      (reqRes) => reqRes.tab === currentTab && reqRes.checked
    );
  },

  //toggles checked in state for entire reqResArray
  toggleSelectAll() {
    const { reqResArray } = store.default.getState().business;

    if (reqResArray.every((obj) => obj.checked === true)) {
      reqResArray.forEach((obj) => (obj.checked = false));
    } else {
      reqResArray.forEach((obj) => (obj.checked = true));
    }
    store.default.dispatch(actions.setChecksAndMinis(reqResArray));
  },

  openReqRes(id) {
    // listens for reqResUpdate event from main process telling it to update reqResobj
    api.receive("reqResUpdate", (reqResObj) => {
      if (
        reqResObj.connection === "closed" &&
        reqResObj.timeSent &&
        reqResObj.timeReceived
      ) {
        store.default.dispatch(actions.updateGraph(reqResObj));
      }
      store.default.dispatch(actions.reqResUpdate(reqResObj));
    });
    console.log('connectionArray', this.openConnectionArray)
    //Since only obj ID is passed in, next two lines get the current array of reqest objects and finds the one with matching ID
    const reqResArr = store.default.getState().business.reqResArray;
    const reqResObj = reqResArr.find((el) => el.id === id);
    if (reqResObj.request.method === "SUBSCRIPTION")
      graphQLController.openSubscription(reqResObj);
    else if (reqResObj.graphQL) {
      graphQLController.openGraphQLConnection(reqResObj);
    } else if (/wss?:\/\//.test(reqResObj.protocol)) {
      // wsController.openWSconnection(reqResObj, this.openConnectionArray);
      //create context bridge to wsController in node process to open connection, send the reqResObj and connection array
      api.send("open-ws", reqResObj, this.openConnectionArray);
      api.receive("update-connectionArray", (connectionArray) => {
        console.log('inside receive');

        this.openConnectionArray.push(...connectionArray);
      })
    }
    //gRPC  connection
    else if (reqResObj.gRPC) {
      api.send("open-grpc", reqResObj);
      //Standard HTTP?
    } else {
      api.send("open-http", reqResObj, this.openConnectionArray);
    }
  },

  openAllSelectedReqRes() {
    connectionController.closeAllReqRes();

    const selectedAndCurrentTabReqResArr = connectionController.getReqRes_CurrentTabAndSelected();

    selectedAndCurrentTabReqResArr.forEach((reqRes) =>
      connectionController.openReqRes(reqRes.id)
    );
  },

  getConnectionObject(id) {
    return this.openConnectionArray.find((obj) => (obj.id = id));
  },

  setReqResConnectionToClosed(id) {
    console.log('inside setReqResConnection to Closed')
    const reqResArr = store.default.getState().business.reqResArray;

    const foundReqRes = reqResArr.find((reqRes) => reqRes.id === id);
    foundReqRes.connection = "closed";
    store.default.dispatch(actions.reqResUpdate(foundReqRes));
  },

  closeReqRes(id) {
    this.setReqResConnectionToClosed(id);
    console.log('inside closeReqRes')
    console.log('id', id)
    console.log('this.openConnectionArray',this.openConnectionArray)
    const foundAbortController = this.openConnectionArray.find(
      (obj) => obj.id === id
    );

    console.log('foundAbort.connection', foundAbortController.connection)
    if (foundAbortController) {
      switch (foundAbortController.protocol) {
        case "HTTP1": {
          foundAbortController.abort.abort();
          break;
        }
        case "HTTP2": {
          foundAbortController.stream.close();
          break;
        }
        case "WS": {
          console.log('inside WS close case');
          // foundAbortController.connection.close()
          api.send('close-ws')
          break;
        }
        default:
          console.log("Invalid Protocol");
      }
      console.log("Connection aborted.");
    }

    this.openConnectionArray = this.openConnectionArray.filter(
      (obj) => obj.id !== id
    );
    console.log('openconnection after filter', this.openConnectionArray)
  },

  /* Closes all open endpoint */
  closeAllReqRes() {
    const selectedAndCurrentTabReqResArr = connectionController.getReqRes_CurrentTabAndSelected();
    selectedAndCurrentTabReqResArr.forEach((reqRes) =>
      connectionController.closeReqRes(reqRes.id)
    );
  },

  clearAllReqRes() {
    connectionController.closeAllReqRes();
    store.default.dispatch(actions.reqResClear());
  },

  //toggles minimized in ReqRes array in state
  toggleMinimizeAll() {
    const { reqResArray } = store.default.getState().business;

    if (reqResArray.every((obj) => obj.minimized === true)) {
      reqResArray.forEach((obj) => (obj.minimized = false));
    } else {
      reqResArray.forEach((obj) => (obj.minimized = true));
    }
    store.default.dispatch(actions.setChecksAndMinis(reqResArray));
  },
  //clears dataPoints from state
  clearGraph() {
    store.default.dispatch(actions.clearGraph());
  },
};

export default connectionController;
