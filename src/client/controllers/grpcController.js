// import { Router } from "express";
import { ipcRenderer } from "electron";
import { remote } from 'electron';
import * as store from '../store';
import * as actions from '../actions/actions';
import { Metadata } from "grpc";



const async = require('async');
const fs = require('fs');
const parseArgs = require('minimist');
const path = require('path');
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

let grpcController = {};


grpcController.openGrpcConnection = (reqResObj, connectionArray) => {
    //check for connection, if not open one

    reqResObj.connectionType = 'GRPC';
    reqResObj.response.times = [];

    // build out variables from reqresObj properties
    let service = reqResObj.service;
    let rpc = reqResObj.rpc;
    let services = reqResObj.servicesObj;
    let packageName = reqResObj.packageName;
    let url = reqResObj.url;
    let queryArr = reqResObj.queryArr;
    if (reqResObj.response.events === null) {
      reqResObj.response.events = [];
    }
    if (reqResObj.response.headers === null) {
      reqResObj.response.headers = {};
    }

    // go through services object, find service where name matches our passed
    // in service, then grab the rpc list of that service, also save that service
    let rpcList;
    let foundService;
    for ( let i = 0; i < services.length; i += 1) {
      let currentService = services[i];
      if ( currentService.name === service) {
        foundService = currentService;
        rpcList = currentService.rpcs;
      }
    }
    // go through that rpcList and find the one that matches passed in rpc,
    // then grab its request and type
    let rpcType;
    let rpcReq;
    let foundRpc;
    for ( let i = 0; i < rpcList.length; i += 1) {
      let currentRPC = rpcList[i];
      if ( currentRPC.name === rpc) {
        foundRpc = currentRPC;
        rpcReq = currentRPC.req;
        rpcType = currentRPC.type;
      }
    }

      // go through definition and using splits, end up with rpcMessageArr as
      // two element array of request and response (rpcMessagesArr)
      let rpcMessagesArr = [foundRpc.req, foundRpc.res];
      // go through messages of our chosen service and grab the keys in an array
      let messageDefObj;
      let keysArray;
      for (let messageIdx in foundService.messages) {
        let message = foundService.messages[messageIdx];

        if (foundRpc.req === message.name || foundRpc.req === 'stream ' +message.name) {
          messageDefObj = message.def;
          keysArray = [];
          Object.keys(messageDefObj).forEach((key)=>{
             keysArray.push(key)
           })
        }
      }
      // build gRPC package definition with protoLoader module
      let PROTO_PATH = reqResObj.protoPath;
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
      // create client credentials
      let serverName = grpc.loadPackageDefinition(packageDefinition)[packageName];
      let client = new serverName[service](`${url}`, grpc.credentials.createInsecure());

      // create client requested metadata key and value pair for each type of streaming
      let meta = new grpc.Metadata()
      let metaArr = reqResObj.request.headers;
      for (let i = 0; i < metaArr.length; i+=1) {
        let currentHeader = metaArr[i];
        meta.add(currentHeader.key, currentHeader.value)
      }

      if (rpcType === 'UNARY') {
        let query = reqResObj.queryArr[0]
        let time = {};

        // Open Connection and set time sent for Unary
        reqResObj.connection = 'open';

        time.timeSent = Date.now();
        // make Unary call
        client[rpc](query, meta, (err, data)=> {

          if (err) {
            console.log('unary error' , err);
          }
          // Close Connection and set time received for Unary
          reqResObj.timeSent = time.timeSent;

          time.timeReceived =  Date.now();
          reqResObj.timeReceived = time.timeReceived

          reqResObj.connection = 'closed';
          reqResObj.response.events.push(data)
          reqResObj.response.times.push(time)
          store.default.dispatch(actions.reqResUpdate(reqResObj));


        }) // metadata from server
        .on('metadata', (metadata) => {
          // if metadata is sent back from the server, analyze and handle
          let keys = Object.keys(metadata._internal_repr)
          for (let i = 0; i < keys.length; i += 1) {
            let key = keys[i];
            reqResObj.response.headers[key] = metadata._internal_repr[key][0];
          }
          store.default.dispatch(actions.reqResUpdate(reqResObj))
        })

      }
      else if (rpcType === 'CLIENT STREAM') {
        // create call and open client stream connection
        reqResObj.connection = 'open';
        let timeSent = Date.now();
        reqResObj.timeSent = timeSent;
        let call = client[rpc](meta, function(error, response) {
          if (error) {
            console.log('error in client stream', error);
            return;
          }
        else {
          //Close Connection for client Stream
          reqResObj.connection = 'closed';
          let curTime = Date.now();
          console.log('curTime client stream: ', curTime);
          reqResObj.response.times.forEach(time => {
            time.timeReceived = curTime;
            console.log('time.timeReceived client stream: ', time.timeReceived);
            reqResObj.timeReceived = time.timeReceived;
            // reqResObj.response.times.push(time)

          })
          reqResObj.response.events.push(response)
          store.default.dispatch(actions.reqResUpdate(reqResObj));

        }}).on('metadata', (metadata) => {
          // if metadata is sent back from the server, analyze and handle
          let keys = Object.keys(metadata._internal_repr)
          for (let i = 0; i < keys.length; i += 1) {
            let key = keys[i];
            reqResObj.response.headers[key] = metadata._internal_repr[key][0];
          }
          store.default.dispatch(actions.reqResUpdate(reqResObj))
        });


        for (let i = 0; i < queryArr.length; i++) {
          let query = queryArr[i];
          // Open Connection for client Stream
          // this needs additional work to provide correct sent time for each
          // request without overwrite
          let time = {};

          reqResObj.connection = 'pending';


          time.timeSent = timeSent;
          console.log('time.timeSent client stream: ', time.timeSent );
          reqResObj.response.times.push(time)


          //reqResObj.connectionType = 'plain';
         // reqResObj.timeSent = Date.now();

          call.write(query);
        }
        call.end();
      }
      else if (rpcType === 'SERVER STREAM') {
        let timesArr = [];
        // Open Connection for SERVER Stream
        reqResObj.connection = 'open';
        reqResObj.timeSent = Date.now();
        const call = client[rpc](reqResObj.queryArr[0], meta);
        call.on("data", resp => {
          let time = {};
          time.timeReceived = Date.now();
          console.log('time.timeReceived Server Stream: ', time.timeReceived);
          time.timeSent = reqResObj.timeSent;
          // add server response to reqResObj and dispatch to state/store
          reqResObj.response.events.push(resp)
          reqResObj.response.times.push(time)
          reqResObj.timeReceived = time.timeReceived; //  overwritten on each call to get the final value

          store.default.dispatch(actions.reqResUpdate(reqResObj));
        })
        call.on('error', () => {
          // for fatal error from server
          console.log('server side stream erring out')
        })
        call.on('end', () => {
          // Close Connection for SERVER Stream
          reqResObj.connection = 'closed';

          // reqResObj.timeReceived = Date.now();
          // console.log('reqResObj.timeReceived Server Stream: ', reqResObj.timeReceived);

          // no need to push response to reqResObj, no event expected from on 'end'
          store.default.dispatch(actions.reqResUpdate(reqResObj));
        })
        call.on('metadata', (metadata) => {
          let keys = Object.keys(metadata._internal_repr)
          for (let i = 0; i < keys.length; i += 1) {
            let key = keys[i];
            reqResObj.response.headers[key] = metadata._internal_repr[key][0];

          }
          store.default.dispatch(actions.reqResUpdate(reqResObj))
        })
      }
      //else BIDIRECTIONAL
      else {
        // Open duplex stream
        let counter = 0;
        let call = client[rpc](meta);
        call.on('data', (response) => {
          let curTimeObj = reqResObj.response.times[counter];
          counter++;
        //Close Individual Server Response for BIDIRECTIONAL Stream
        reqResObj.connection = 'pending';
        curTimeObj.timeReceived = Date.now();
        reqResObj.timeReceived = curTimeObj.timeReceived;
        console.log('curTimeObj.timeReceived BIDI on data: ', curTimeObj.timeReceived);
        console.log('reqResObj.timeReceived BIDI on data: ', reqResObj.timeReceived);
        reqResObj.response.events.push(response);
        reqResObj.response.times.push(curTimeObj);
        store.default.dispatch(actions.reqResUpdate(reqResObj));


        }) // metadata from server
          call.on('metadata', (metadata) => {
            let keys = Object.keys(metadata._internal_repr)
            for (let i = 0; i < keys.length; i += 1) {
              let key = keys[i];
              reqResObj.response.headers[key] = metadata._internal_repr[key][0];

            }
            store.default.dispatch(actions.reqResUpdate(reqResObj))
          });
        call.on('error', ()=> {
          console.log('server ended connection with error')
        })
        call.on('end', (data)=> {
          //Close Final Server Connection for BIDIRECTIONAL Stream
          reqResObj.connection = 'closed';
          // reqResObj.timeReceived = Date.now();
          // console.log('reqResObj.timeReceived BIDI on end: ', reqResObj.timeReceived);
          // no need to push response to reqResObj, no event expected from on 'end'
          store.default.dispatch(actions.reqResUpdate(reqResObj));
        });

        for (var i = 0; i < queryArr.length; i++) {
          let time = {};
          let query = queryArr[i];
          //Open Connection for BIDIRECTIONAL Stream
          if (i === 0){
            reqResObj.connection = 'open';
          } else {
            reqResObj.connection = 'pending';
          }
          time.timeSent = Date.now();
          console.log('time.timeSent open connection for BIDI: ', time.timeSent);
          reqResObj.timeSent = time.timeSent;
          console.log('reqResObj.timeSent open connection for BIDI: ', reqResObj.timeSent);
          reqResObj.response.times.push(time)
          call.write(query);
        }
        call.end();
      }
    // reqResObj.connection = 'closed';
    // reqResObj.timeReceived = Date.now();
    // console.log('reqResObj.timeReceived end of controller unspecified: ', reqResObj.timeReceived);
    store.default.dispatch(actions.reqResUpdate(reqResObj));
};
export default grpcController;
