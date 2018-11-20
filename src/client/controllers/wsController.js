import * as store from '../store';
import * as actions from '../actions/actions';

const wsController = {
  openWSconnection(reqResObj) {
    reqResObj.response.messages = [];
    reqResObj.response.messages = [];
    reqResObj.connection = 'pending';
    reqResObj.timeSent = Date.now();
    store.default.dispatch(actions.reqResUpdate(reqResObj));

    const socket = new WebSocket(reqResObj.url);
  }
};

export default wsController;