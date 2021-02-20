const { ipcMain } = require("electron");
// const store = require('./src/client/store.js')
const WebSocketClient = require("websocket").client;

const wsController = {
  wsConnect: null,
  openWSconnection(event, reqResObj, connectionArray) {
    //set reqResObj for WS
    reqResObj.response.messages = [];
    reqResObj.request.messages = [];
    reqResObj.connection = "pending";
    reqResObj.closeCode = 0;
    reqResObj.timeSent = Date.now();

    //update frontend its pending
    event.sender.send("reqResUpdate", reqResObj);

    //create socket
    //check websocket npm package doc
    let socket;
    try {
      console.log("creating socket");
      socket = new WebSocketClient();
    } catch (err) {
      reqResObj.connection = "error";
      console.log("websocket creation errror==>", err);
      event.sender.send("reqResUpdate", reqResObj);
      return;
    }

    //when it connects, update connectionArray
    //connection here means a single connection being established
    socket.on("connect", (connection) => {
      console.log("websocket client connected");
      this.wsConnect = connection;
      reqResObj.connection = "open";
      const openConnectionObj = {
        connection,
        protocol: "WS",
        id: reqResObj.id,
      };
      connectionArray.push(openConnectionObj);
      //console.log("connectionArr=>", connectionArray);
      event.sender.send("update-connectionArray", connectionArray);
      event.sender.send("reqResUpdate", reqResObj);
      //connection.on
      this.wsConnect.on("close", () => {
        console.log("closed WS");
      });
    });

    //listener for failed socket connection,
    socket.on("connectFailed", (error) => {
      console.log("WS Connect Error: " + error.toString());
      reqResObj.connection = "error";
      reqResObj.timeReceived = Date.now();
      // reqResObj.response.events.push(JSON.stringify(errorsObj));
      event.sender.send("reqResUpdate", reqResObj);
    });

    //connect socket
    socket.connect(reqResObj.url);
  },

  closeWs(event) {
    //connection.close
    this.wsConnect.close();
  },

  sendWebSocketMessage(event, reqResObj, inputMessage) {
    //send message to ws server
    //connection.send

    //check datatype
    console.log("input message pre-send", inputMessage);

    if (inputMessage.includes("data:image/")) {
      const buffer = Buffer.from(inputMessage, "utf8");
      console.log("sending as buffer");
      this.wsConnect.sendBytes(buffer);
      reqResObj.request.messages.push({
        data: buffer,
        timeReceived: Date.now(),
      });
    } else {
      this.wsConnect.send(inputMessage);
      console.log("sending as string");
      reqResObj.request.messages.push({
        data: inputMessage,
        timeReceived: Date.now(),
      });
    }

    //update store
    event.sender.send("reqResUpdate", reqResObj);

    //listener for return message from ws server
    //push into message array under responses
    //connection.on
    this.wsConnect.on("message", (e) => {
      e.binaryData
        ? reqResObj.response.messages.push({
            data: e.binaryData,
            timeReceived: Date.now(),
          })
        : reqResObj.response.messages.push({
            data: e.utf8Data,
            timeReceived: Date.now(),
          });

      //update store
      event.sender.send("reqResUpdate", reqResObj);
    });
  },
};
module.exports = () => {
  // we pass the event object into these controller functions so that we can invoke event.sender.send when we need to make response to renderer process
  // listener to open wsconnection
  ipcMain.on("open-ws", (event, reqResObj, connectionArray) => {
    wsController.openWSconnection(event, reqResObj, connectionArray);
  });
  //listener for sending messages to server
  ipcMain.on("send-ws", (event, reqResObj, inputMessage) => {
    //console.log("send-ws event===>", event);
    //console.log("send-ws reqResObj===>", reqResObj);
    wsController.sendWebSocketMessage(event, reqResObj, inputMessage);
  });
  //listerner to close socket connection
  ipcMain.on("close-ws", (event) => {
    wsController.closeWs(event);
  });
};
