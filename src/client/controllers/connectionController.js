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

};

export default connectionController;
