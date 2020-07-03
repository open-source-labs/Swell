const nodeFetch = require('node-fetch'); 
const http2 = require("http2");
const setCookie = require("set-cookie-parser");

const httpMainController = {}; 

// array of open http2 connections
httpMainController.openHTTP2Connections = []; 

httpMainController.openHTTPconnection = (reqResObj, connectionArray) => {
  // http2 is currentonly supported over https
  reqResObj.protocol === "https://"
    ? httpController.establishHTTP2Connection(reqResObj, connectionArray)
    : httpController.establishHTTP1connection(reqResObj, connectionArray);
};

httpMainController.establishHTTP2Connection = (reqResObj, connectionArray) => {
    /*
      Attempt to find an existing HTTP2 connection in openHTTP2Connections Array.
      If exists, use connection to initiate request
      If not, create connection, push to array, and then initiate request
    */

    // find connection with same host as passed in reqResObj 
   const foundHTTP2Connection = httpMainController.openHTTP2Connections.find(
    (conn) => conn.host === reqResObj.host
  );

  // EXISTING HTTP2 CONNECTION IS FOUND -----

  if (foundHTTP2Connection) {
    const { client } = foundHTTP2Connection;

    // periodically check if the client is open or destroyed, and attach if conditions are met
    const interval = setInterval(() => {
      if (foundHTTP2Connection.status === "connected") {
        this.attachRequestToHTTP2Client(client, reqResObj, connectionArray);
        clearInterval(interval);
      }
      // if failed, could because of protocol error. try HTTP1
      else if (foundHTTP2Connection.status === "failed" || client.destroyed) {
        httpController.establishHTTP1connection(reqResObj, connectionArray);
        clearInterval(interval);
      }
    }, 50);

  // --------------------------------------------------
      // if hasnt changed in 10 seconds, mark as error
      // --------------------------------------------------
      setTimeout(() => {
        clearInterval(interval);
        if (foundHTTP2Connection.status === "initialized") {
          reqResObj.connection = "error";
          store.default.dispatch(actions.reqResUpdate(reqResObj));
        }
      }, 10000);
    }; 
}