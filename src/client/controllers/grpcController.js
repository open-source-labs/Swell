import { Router } from "express";
import { ipcRenderer } from "electron";

var PROTO_PATH = __dirname + '/../../../protos/savedfile.proto';

var async = require('async');
var fs = require('fs');
var parseArgs = require('minimist');
var path = require('path');
// var grpc = impo('grpc');
// import grpc from "grpc";
// var protoLoader = require('@grpc/proto-loader');


let rpcFunctions = [0, 1, 2, 3];
let grpcController = {};

grpcController.openGrpcConnection = (reqResObj, connectionArray) => {
    //check for connection, if not open one
    console.log('we made it to grpcController, noice')
    if (connection) {
        //do stuff
    }
    else {
        //STUFF that we probably will need from reqresobj/state
        //proto file already parsed and details passed to state and then to reqresObj
        //service name = reqResObj.grpcServiceName 
        //serverName = reqResObj.grpcServerName
        //serviceFunctionType = reqResObj.serviceFunctionType
        //serviceFunction = reqResObj.serviceFunction
        //     this.ws = websocket;
        // this.url = undefined
        // this.serviceInput =  undefined;
        // this.messageInput = undefined;
        // this.requestInput = undefined;
        // this.package = undefined;
        // this.protoFile = undefined;
        // this.streamType = undefined;
        // this._call = undefined;
        //write the proto file we uploaded somewhere, then add that as protopath?
        fs.writeFileSync("./protos/output.proto", this.protoFile, "utf8", function (err) {
            if (err) {
              console.log("An error occurred while writing JSON Object to File.");
              return console.log(err);
            }
            console.log("JSON file has been saved.");
          });
        let server = this.url;
        let PROTO_PATH = "./protos/output.proto";
        packageDefinition = protoLoader.loadSync(
            PROTO_PATH,
            {
                keepCase: true,
                longs: String,
                enums: String,
                defaults: true,
                oneofs: true
        
            }
        )
        let serverName = grpc.loadPackageDefinition(packageDefinition).serviceInput;
        let client = new serverName[this.serviceInput](server, grpc.credentials.createInsecure());
        // if (serviceFunctionType === 'unary') {
        //     runUnary();
        // }
        // else if (serviceFunctionType === 'clientStream') {
        //     runClientStream();
        // }
        // else if (serviceFunctionType === 'serverStream') {
        //     runServerStream();
        // }
        // else {
        //     runBidiStream();
        // }
       

    }


    const sendGrpcToMain = (args) => {
        return new Promise(resolve => {
            ipcRenderer.send('open-grpc', args)
            ipcRenderer.on('reply-grpc', (event, result) => {
            // needs formatting because component reads them in a particular order
            result.reqResObj.response.cookies = this.cookieFormatter(result.reqResObj.response.cookies);
            resolve(result);
        })
      })
    }
    const openGrpcConnection = (reqResObj) => {
    // initialize response data
        reqResObj.response.headers = {};
        reqResObj.response.events = [];
        reqResObj.response.cookies = [];
        reqResObj.connection = 'open';
        reqResObj.timeSent = Date.now();
        store.default.dispatch(actions.reqResUpdate(reqResObj));
        
        this.sendGrpcToMain({reqResObj})
        .then(response => {
        response.error ? this.handleError(response.error, response.reqResObj) : this.handleResponse(response.data, response.reqResObj);
        });
  }
  const handleResponse = (response, reqResObj) => {
    reqResObj.connection = 'closed';
    reqResObj.connectionType = 'plain';
    reqResObj.timeReceived = Date.now();
    reqResObj.response.events.push(JSON.stringify(response.data));
    store.default.dispatch(actions.reqResUpdate(reqResObj));
  }
  
  const handleError =  (errorsObj, reqResObj) => {
    reqResObj.connection = 'error';
    reqResObj.timeReceived = Date.now();
    reqResObj.response.events.push(JSON.stringify(errorsObj));
    store.default.dispatch(actions.reqResUpdate(reqResObj));
  }
    const runUnary = (callback) => {
        function featureCallback(error, feature) {
        if (error) {
            callback(error);
            return;
        }
        if (feature.name === '') {
            console.log('Found no feature');
        } else {
            console.log('Found feature called' , feature);
            //save && display data
        }
        
        }
    
    client[serviceFunction]((objToSendFromReq), featureCallback);
  }
};
export default grpcController;