import * as store from '../store';
import * as actions from '../actions/actions';
import httpController from './httpController.js';
import wsController from './wsController.js';

const connectionController = {
  openConnectionArray: [],
  // selectedArray:[],

  getReqRes_CurrentTabAndSelected() {
    const { reqResArray } = store.default.getState().business;

    const { currentTab } = store.default.getState().business;

    return reqResArray.filter(reqRes => reqRes.tab === currentTab && reqRes.checked);
  },

  selectAllResReq() {
    const { reqResArray } = store.default.getState().business;

    const { currentTab } = store.default.getState().business;

    reqResArray.forEach((reqRes) => {
      if (!reqRes.checked && reqRes.tab === currentTab) {
        reqRes.checked = true;
        store.default.dispatch(actions.reqResUpdate(reqRes));
      }
    });
  },

  deselectAllResReq() {
    const { reqResArray } = store.default.getState().business;

    const { currentTab } = store.default.getState().business;

    reqResArray.forEach((reqRes) => {
      if (reqRes.checked && reqRes.tab === currentTab) {
        reqRes.checked = false;
        store.default.dispatch(actions.reqResUpdate(reqRes));
      }
    });
  },

  openReqRes(id) {
    const reqResArr = store.default.getState().business.reqResArray;
    const reqResObj = reqResArr.find(el => el.id === id);

    reqResObj.protocol === 'ws://'
      ? wsController.openWSconnection(reqResObj, this.openConnectionArray)
      : httpController.openHTTPconnection(reqResObj, this.openConnectionArray);
  },

  openAllSelectedReqRes() {
    connectionController.closeAllReqRes();

    const selectedAndCurrentTabReqResArr = connectionController.getReqRes_CurrentTabAndSelected();

    selectedAndCurrentTabReqResArr.forEach(reqRes => connectionController.openReqRes(reqRes.id));
  },

  getConnectionObject(id) {
    return this.openConnectionArray.find(obj => (obj.id = id));
  },

  setReqResConnectionToClosed(id) {
    const reqResArr = store.default.getState().business.reqResArray;

    const foundReqRes = reqResArr.find(reqRes => reqRes.id === id);
    foundReqRes.connection = 'closed';
    store.default.dispatch(actions.reqResUpdate(foundReqRes));
  },

  closeReqRes(id) {
    this.setReqResConnectionToClosed(id);

    const foundAbortController = this.openConnectionArray.find(obj => (obj.id = id));

    console.log(this.openConnectionArray);
    console.log(foundAbortController);

    if (foundAbortController) {
      switch (foundAbortController.protocol) {
        case 'HTTP1': {
          foundAbortController.abort.abort();
          break;
        }
        case 'HTTP2': {
          foundAbortController.stream.close();
          break;
        }
        case 'WS': {
          foundAbortController.socket.close();
          break;
        }
        default:
          console.log('Invalid Protocol');
      }
      console.log('Connection aborted.');
    }

    this.openConnectionArray = this.openConnectionArray.filter(obj => obj.id !== id);
  },

  /* Closes all open endpoint */
  closeAllReqRes() {
    const selectedAndCurrentTabReqResArr = connectionController.getReqRes_CurrentTabAndSelected();

    selectedAndCurrentTabReqResArr.forEach(reqRes => connectionController.closeReqRes(reqRes.id));
  },

  clearAllReqRes() {
    connectionController.closeAllReqRes();
    store.default.dispatch(actions.reqResClear());
  },
};

export default connectionController;
