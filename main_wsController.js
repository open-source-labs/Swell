const { ipcMain } = require("electron");
const WebSocketClient = require('websocket').client

const wsController = {
    openWSconnection(event, reqResObj, connectionArray) {
      console.log('inside openWSconnection main');
      reqResObj.response.messages = [];
      reqResObj.request.messages = [];
      reqResObj.connection = 'pending';
      reqResObj.closeCode = 0;
      reqResObj.timeSent = Date.now();
      // store.default.dispatch(actions.reqResUpdate(reqResObj));
      event.sender.send("reqResUpdate", reqResObj);

      console.log('reqResObj',reqResObj)
      let socket;
      try {
        console.log('inside try')
        console.log('url', reqResObj.url)
        socket = new WebSocketClient()
        socket.connect(reqResObj.url);
        console.log('socket', socket)
      }
      catch (err) {
        console.log('socket', socket)
        console.log('inside catch')
        reqResObj.connection = 'error';
        // store.default.dispatch(actions.reqResUpdate(reqResObj));
        event.sender.send("reqResUpdate", reqResObj);
        return;
      }
  
      socket.on('connect', () => {
        console.log('inside open event')
        reqResObj.connection = 'open';
        // store.default.dispatch(actions.reqResUpdate(reqResObj));
        event.sender.send("reqResUpdate", reqResObj);

      });
  
      //when there is an incoming message, update the reqResObj
      socket.on('message', (event) => {
        console.log('inside message event')
  
        // get fresh copy of reqRes
        reqResObj = store.default
          .getState()
          .business.reqResArray.find(obj => obj.id === reqResObj.id);
  
        reqResObj.response.messages.push({
          data: event.data,
          timeReceived: Date.now(),
        });
  
        // store.default.dispatch(actions.reqResUpdate(reqResObj));
        event.sender.send("reqResUpdate", reqResObj);

      });
  
      //added error event listener 
      socket.on('error', function (event) {
        console.log('WebSocket error: ', event);
      });
  
      //when the socket closes set close event on reqResObj and update store
      socket.on('close', (event) => {
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
  
        // store.default.dispatch(actions.reqResUpdate(reqResObj));
        event.sender.send("reqResUpdate", reqResObj);

      });
  
      const openConnectionObj = {
        socket,
        protocol: 'WS',
        id: reqResObj.id,
      };
      console.log('before openconnection push')
      connectionArray.push(openConnectionObj);
      console.log('connectionArray', connectionArray)
      event.sender.send("reqResUpdate", reqResObj);

    },
  
    sendWebSocketMessage(event, reqResId, message) {
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
      event.sender.send("reqResUpdate", reqResObj);

    },
  };
module.exports = () => {
    // creating our event listeners for IPC events
    ipcMain.on("open-ws", (event, reqResObj, connectionArray) => {
      // we pass the event object into these controller functions so that we can invoke event.sender.send when we need to make response to renderer process
      wsController.openWSconnection(event, reqResObj, connectionArray);
    });
    ipcMain.on("send-ws", (event, reqResObj, inputMessage) => {
      // we pass the event object into these controller functions so that we can invoke event.sender.send when we need to make response to renderer process
      wsController.openWSconnection(event, reqResObj, inputMessage);
    });
  };