import * as store from "../store";
import * as actions from "../actions/actions";
// import httpController from "./httpController.js";
// import wsController from "./wsController.js";
// import graphQLController from "./graphQLController.js";
// import grpcController from "./grpcController.js";

const { api } = window; 
let events; 
const connectionController = {
  openConnectionArray: [],
  // selectedArray:[],

  getReqRes_CurrentTabAndSelected() {
    const { reqResArray } = store.default.getState().business;

    const { currentTab } = store.default.getState().business;

    return reqResArray.filter(
      (reqRes) => reqRes.tab === currentTab && reqRes.checked
    );
  },

  selectAllReqRes() {
    const { reqResArray } = store.default.getState().business;

    const { currentTab } = store.default.getState().business;

    reqResArray.forEach((reqRes) => {
      if (!reqRes.checked && reqRes.tab === currentTab) {
        reqRes.checked = true;
      }
    });
    store.default.dispatch(actions.setChecksAndMinis(reqResArray));
  },

  deselectAllReqRes() {
    const { reqResArray } = store.default.getState().business;

    const { currentTab } = store.default.getState().business;

    reqResArray.forEach((reqRes) => {
      if (reqRes.checked && reqRes.tab === currentTab) {
        reqRes.checked = false;
      }
    });
    store.default.dispatch(actions.setChecksAndMinis(reqResArray));
  },

  openReqRes(id) {
    // listens for reqResUpdate event from main process telling it to update reqResobj
    api.receive('reqResUpdate', (reqResObj) => store.default.dispatch(actions.reqResUpdate(reqResObj)));
    
    const reqResArr = store.default.getState().business.reqResArray;
    const reqResObj = reqResArr.find((el) => el.id === id);
    if (reqResObj.request.method === "SUBSCRIPTION")
      graphQLController.openSubscription(reqResObj);
    else if (reqResObj.graphQL)
      graphQLController.openGraphQLConnection(reqResObj);
    else if (/wss?:\/\//.test(reqResObj.protocol))
      wsController.openWSconnection(reqResObj, this.openConnectionArray);
    else if (reqResObj.gRPC) grpcController.openGrpcConnection(reqResObj);
    else {
      // sends request to main process to open an http connections
      api.send('open-http', reqResObj, this.openConnectionArray);
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
    const reqResArr = store.default.getState().business.reqResArray;

    const foundReqRes = reqResArr.find((reqRes) => reqRes.id === id);
    foundReqRes.connection = "closed";
    store.default.dispatch(actions.reqResUpdate(foundReqRes));
  },

  closeReqRes(id) {
    this.setReqResConnectionToClosed(id);

    const foundAbortController = this.openConnectionArray.find(
      (obj) => obj.id === id
    );

    console.log('this is openConnection array : ', this.openConnectionArray)

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
          foundAbortController.socket.close();
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

  minimizeAllReqRes() {
    const { reqResArray } = store.default.getState().business;

    const { currentTab } = store.default.getState().business;

    reqResArray.forEach((reqRes) => {
      if (!reqRes.minimized && reqRes.tab === currentTab) {
        reqRes.minimized = true;
      }
    });
    store.default.dispatch(actions.setChecksAndMinis(reqResArray));
  },

  expandAllReqRes() {
    const { reqResArray } = store.default.getState().business;

    const { currentTab } = store.default.getState().business;

    reqResArray.forEach((reqRes) => {
      if (reqRes.minimized && reqRes.tab === currentTab) {
        reqRes.minimized = false;
      }
    });
    store.default.dispatch(actions.setChecksAndMinis(reqResArray));
  },
};

export default connectionController;
