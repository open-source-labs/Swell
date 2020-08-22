import * as store from '../store';
import * as actions from '../actions/actions';
import connectionController from './reqResController.js';

const wsController = {
  openWSconnection(reqResObj, connectionArray) {
    reqResObj.response.messages = [];
    reqResObj.request.messages = [];
    reqResObj.connection = 'pending';
    reqResObj.closeCode = 0;
    reqResObj.timeSent = Date.now();
    store.default.dispatch(actions.reqResUpdate(reqResObj));

    let socket;
    try {
      socket = new WebSocket(reqResObj.url);
    }
    catch (err) {
      reqResObj.connection = 'error';
      store.default.dispatch(actions.reqResUpdate(reqResObj));
      return;
    }

    socket.addEventListener('open', () => {
      console.log('inside open event')
      reqResObj.connection = 'open';
      store.default.dispatch(actions.reqResUpdate(reqResObj));
    });

    //when there is an incoming message, update the reqResObj
    socket.addEventListener('message', (event) => {
      console.log('inside message event')

      // get fresh copy of reqRes
      reqResObj = store.default
        .getState()
        .business.reqResArray.find(obj => obj.id === reqResObj.id);

      reqResObj.response.messages.push({
        data: event.data,
        timeReceived: Date.now(),
      });

      store.default.dispatch(actions.reqResUpdate(reqResObj));
    });

    //added error event listener 
    socket.addEventListener('error', function (event) {
      console.log('WebSocket error: ', event);
    });

    //when the socket closes set close event on reqResObj and update store
    socket.onclose = (event) => {
      console.log('inside close event')
      
      // get fresh copy of reqRes
      reqResObj = store.default
        .getState()
        .business.reqResArray.find(obj => obj.id === reqResObj.id);

      //  attach close code to reqResObj
      reqResObj.closeCode = event.code;

      switch (event.code) {
        case 1006: {
          reqResObj.connection = 'error';
          break;
        }
        default: {
          reqResObj.connection = 'closed';
          break;
        }
      }

      store.default.dispatch(actions.reqResUpdate(reqResObj));
    };

    const openConnectionObj = {
      socket,
      protocol: 'WS',
      id: reqResObj.id,
    };
    connectionArray.push(openConnectionObj);
  },

  sendWebSocketMessage(reqResId, message) {
    console.log('in sendWSMessage')
    const matchedConnection = connectionController.getConnectionObject(reqResId);
    matchedConnection.socket.send(message);

    // get fresh copy of reqRes
    const reqResObj = store.default.getState().business.reqResArray
      .find(obj => obj.id === reqResId);

    console.log('reqRes before', reqResObj); 
    //adds to reqResObj in state to  
    reqResObj.request.messages.push({
      data: message,
      timeReceived: Date.now(),
    });
    console.log('reqRes after', reqResObj);
  },
};

export default wsController;
