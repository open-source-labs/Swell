// import { Router } from "express";
import { ipcRenderer } from "electron";
import { remote } from 'electron';

var PROTO_PATH = __dirname + '/../../../protos/savedfile.proto';

var async = require('async');
var fs = require('fs');
var parseArgs = require('minimist');
var path = require('path');
const grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');


// let rpcFunctions = [0, 1, 2, 3];
let grpcController = {};
//package helloworld;
// service Greeter {
//   // Sends a greeting
//   rpc SayHello (HelloRequest) returns (HelloReply) {}
//   rpc SayHelloCS (stream HelloRequest) returns (HelloReply) {}
//   rpc SayHellos (HelloRequest) returns (stream HelloReply) {}
//   rpc SayHelloBidi (stream HelloRequest) returns (stream HelloReply) {}
// }
// // The request message containing the user's name.
// message HelloRequest {
//   string name = 1;
// }
// // The response message containing the greetings
// message HelloReply {
//   string message = 1;
// }
const packageName = "helloworld";
  const services = [{
    name: 'Greeter',
    messages: [
      {name: "HelloRequest",
      def : "string name = 1;"
      },
      {name: "HelloReply",
        def : "string message = 1;"
        }
    ],
    rpcs: [
      {name: "SayHello",
        definition: "rpc (HelloRequest) returns (HelloReply) {}"
      },
      {name: "SayHelloCS",
        definition: "rpc (stream HelloRequest) returns (HelloReply) {}"
      },
      {name: "SayHellos",
        definition: "rpc (HelloRequest) returns (stream HelloReply) {}"
      },
      {name: "SayHelloBidi",
        definition: "rpc (stream HelloRequest) returns (stream HelloReply) {}"
      },
    ]
  }];

grpcController.openGrpcConnection = (reqResObj, connectionArray) => {
    //check for connection, if not open one
    console.log('we made it to grpcController, noice')
    if (false) {
        //use existing connection
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

        // let server = this.url;
        function runCallback(error, response){
          if (error) {
            console.log(error);
            return;
          }
          if (response === '') {
            console.log('Found no helloReply at ')
          } else {
            console.log('Found reply called "' + response.message)
        }
      }
        const dirName = remote.app.getAppPath();
        const service = services[0].name;
        const rpc = services[0].rpcs[0].name;
        let PROTO_PATH = path.join( dirName, "grpc_mockData/protos/hw2.proto")
        const packageDefinition = protoLoader.loadSync(
            PROTO_PATH,
            {
                keepCase: true,
                longs: String,
                enums: String,
                defaults: true,
                oneofs: true

            }
        )
        let serverName = grpc.loadPackageDefinition(packageDefinition)[packageName];
        let client = new serverName[service]('localhost:50051', grpc.credentials.createInsecure());
        client[rpc]({name: 'Evan'}, runCallback)
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
