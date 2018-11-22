import * as store from '../store';
import * as actions from '../actions/actions';
import httpController from './httpController.js';
import wsController from './wsController.js'

const connectionController = {
  openConnectionArray:[],
  // selectedArray:[],

  getReqRes_CurrentTabAndSelected () {
    const reqResArr = store.default.getState().business.reqResArray;

    const currentTab = store.default.getState().business.currentTab;

    return reqResArr.filter(reqRes => reqRes.tab === currentTab && reqRes.checked);
  },

  selectAllResReq() {
    const reqResArr = store.default.getState().business.reqResArray;

    const currentTab = store.default.getState().business.currentTab;

    reqResArr.forEach(reqRes => {
      if (!reqRes.checked && reqRes.tab === currentTab) {
        reqRes.checked = true;
        store.default.dispatch(actions.reqResUpdate(reqRes));
      }
    })
  },

  deselectAllResReq() {
    const reqResArr = store.default.getState().business.reqResArray;

    const currentTab = store.default.getState().business.currentTab;

    reqResArr.forEach(reqRes => {
      if (reqRes.checked && reqRes.tab === currentTab) {
        reqRes.checked = false;
        store.default.dispatch(actions.reqResUpdate(reqRes));
      }
    })
  },

  openReqRes(id) {
    const reqResArr = store.default.getState().business.reqResArray;
    const reqResObj = reqResArr.find((el) => el.id == id);

    let connectionObject = reqResObj.protocol === 'ws://' ? wsController.openWSconnection(reqResObj) : httpController.openHTTPconnection(reqResObj);

    this.openConnectionArray.push(connectionObject);
  },

  openAllSelectedReqRes() {
    connectionController.closeAllReqRes();

    let selectedAndCurrentTabReqResArr = connectionController.getReqRes_CurrentTabAndSelected();
    
    selectedAndCurrentTabReqResArr.forEach(reqRes => connectionController.openReqRes(reqRes.id));
  },

  getConnectionObject(id) {
    return this.openConnectionArray.find(obj => obj.id = id);
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
      switch (foundAbortController.protocol) {
        case 'HTTP': {
          foundAbortController.abort.abort();
          break;
        }
        case 'WS': {
          foundAbortController.socket.close();
          break;
        }
      }
      console.log('Connection aborted.');
    }
    
    this.openConnectionArray = this.openConnectionArray.filter(obj => obj.id !== id);
  },

  /* Closes all open endpoint */
  closeAllReqRes() {
    let selectedAndCurrentTabReqResArr = connectionController.getReqRes_CurrentTabAndSelected();

    selectedAndCurrentTabReqResArr.forEach(reqRes => connectionController.closeReqRes(reqRes.id));
  },

  clearAllReqRes() {
    connectionController.closeAllReqRes();
    store.default.dispatch(actions.reqResClear());
  },

};

export default connectionController;
