import * as store from '../store';
import * as actions from '../actions/actions';
import connectionController from './connectionController.js'

const wsController = {
  openWSconnection(reqResObj, connectionArray) {
    reqResObj.response.messages = [];
    reqResObj.request.messages = [];
    reqResObj.connection = 'pending';
    reqResObj.timeSent = Date.now();
    store.default.dispatch(actions.reqResUpdate(reqResObj));

    let socket;
    try {
      socket = new WebSocket(reqResObj.url);
    } catch (err) {
      reqResObj.connection = 'error';
      store.default.dispatch(actions.reqResUpdate(reqResObj));
      return;
    }
    
    socket.addEventListener('open', () => {
      reqResObj.connection = 'open';
      store.default.dispatch(actions.reqResUpdate(reqResObj));
    });

    socket.addEventListener('message', function (event) {

      //get fresh copy of reqRes
      reqResObj = store.default.getState().business.reqResArray.find(obj => obj.id === reqResObj.id);

      reqResObj.response.messages.push({
        data : event.data,
        timeReceived : Date.now(),
      });
      store.default.dispatch(actions.reqResUpdate(reqResObj));
    });

    socket.onclose = (event) => {
      //get fresh copy of reqRes
      reqResObj = store.default.getState().business.reqResArray.find(obj => obj.id === reqResObj.id);

      switch (event.code) {
        case 1006 : {
          reqResObj.connection = 'error';
          break;
        }
        default : {
          reqResObj.connection = 'closed';
          break;
        }
      }
      store.default.dispatch(actions.reqResUpdate(reqResObj));
    }

    const openConnectionObj = {
      socket : socket,
      protocol : 'WS',
      id : reqResObj.id,
    }
    connectionArray.push(openConnectionObj);
  },
  
  sendWebSocketMessage (reqResId, message) {
    let matchedConnection = connectionController.getConnectionObject(reqResId);

    matchedConnection.socket.send(message);

    //get fresh copy of reqRes
    let reqResObj = store.default.getState().business.reqResArray.find(obj => obj.id === reqResId);

    reqResObj.request.messages.push({
      data : message,
      timeReceived : Date.now(),
    })

  }
};

export default wsController;