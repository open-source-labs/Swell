// import { Router } from "express";
// import { ipcRenderer } from "electron";
// import { remote } from "electron";
// import { Metadata } from "@grpc/grpc-js";

import * as store from "../store";
import * as actions from "../actions/actions";

const { api } = window;

// const async = require("async");
// const fs = require("fs");
// const parseArgs = require("minimist");
// const path = require("path");

// const grpc = require("@grpc/grpc-js");
// const protoLoader = require("@grpc/proto-loader");

const grpcController = {};

grpcController.openGrpcConnection = (reqResObj, connectionArray) => {
  //check for connection, if not open one

  // check what's inside reqResobj
  console.log("reqResObj inside gRPC controller is", reqResObj);

  reqResObj.connectionType = "GRPC";
  reqResObj.response.times = [];

  // build out variables from reqresObj properties
  const { service, rpc, packageName, url, queryArr } = reqResObj;
  const services = reqResObj.servicesObj;
  if (reqResObj.response.events === null) {
    reqResObj.response.events = [];
  }
  if (reqResObj.response.headers === null) {
    reqResObj.response.headers = {};
  }

  // go through services object, find service where name matches our passed
  // in service, then grab the rpc list of that service, also save that service
  // let rpcList;
  let foundService;
  let rpcType;
  let foundRpc;

  for (let i = 0; i < services.length; i++) {
    if (services[i].name === service) {
      foundService = services[i];
      // now loop through the rpcList and get our rpc along with rpc type
      for (let j = 0; j < foundService.rpcs.length; j++) {
        if (foundService.rpcs[j].name === rpc) {
          foundRpc = foundService.rpcs[j];
          rpcType = foundRpc.type;
        }
      }
    }
  }

  console.log("foundService", foundService);
  console.log("foundRpc", foundRpc);
  console.log("rpcType", rpcType);

  // build gRPC package definition with protoLoader module
  const PROTO_PATH = reqResObj.protoPath;

  // const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  //   keepCase: true,
  //   longs: String,
  //   enums: String,
  //   defaults: true,
  //   oneofs: true,
  // });
  // create client credentials
  // const serverName = grpc.loadPackageDefinition(packageDefinition)[packageName];
  // const client = new serverName[service](
  //   `${url}`,
  //   grpc.credentials.createInsecure()
  // );

  // create client requested metadata key and value pair for each type of streaming
  // const meta = new grpc.Metadata();
  // const metaArr = reqResObj.request.headers;
  // for (let i = 0; i < metaArr.length; i += 1) {
  //   const currentHeader = metaArr[i];
  //   meta.add(currentHeader.key, currentHeader.value);
  // }

  api.receive("meta-and-client", (meta, client) => {
    console.log("receiving from main process");
    console.log("meta->", meta);
    console.log("client ->", client);
    /*
    if (rpcType === "UNARY") {
      console.log("inside UNARY if statement");
      const query = reqResObj.queryArr[0];
      const time = {};

      // Open Connection and set time sent for Unary
      reqResObj.connection = "open";

      time.timeSent = Date.now();
      // make Unary call
      client[rpc](query, meta, (err, data) => {
        if (err) {
          console.log("unary error", err);
        }
        // Close Connection and set time received for Unary
        reqResObj.timeSent = time.timeSent;

        time.timeReceived = Date.now();
        reqResObj.timeReceived = time.timeReceived;

        reqResObj.connection = "closed";
        reqResObj.response.events.push(data);
        reqResObj.response.times.push(time);
        store.default.dispatch(actions.reqResUpdate(reqResObj));
      }) // metadata from server
        .on("metadata", (metadata) => {
          // if metadata is sent back from the server, analyze and handle
          const keys = Object.keys(metadata._internal_repr);
          for (let i = 0; i < keys.length; i += 1) {
            const key = keys[i];
            reqResObj.response.headers[key] = metadata._internal_repr[key][0];
          }
          store.default.dispatch(actions.reqResUpdate(reqResObj));
        });
    } else if (rpcType === "CLIENT STREAM") {
      // create call and open client stream connection
      reqResObj.connection = "open";
      const timeSent = Date.now();
      reqResObj.timeSent = timeSent;
      const call = client[rpc](meta, function (error, response) {
        if (error) {
          console.log("error in client stream", error);
          return undefined;
        }
        //Close Connection for client Stream
        reqResObj.connection = "closed";
        const curTime = Date.now();
        reqResObj.response.times.forEach((time) => {
          time.timeReceived = curTime;
          reqResObj.timeReceived = time.timeReceived;
        });
        reqResObj.response.events.push(response);
        store.default.dispatch(actions.reqResUpdate(reqResObj));
      }).on("metadata", (metadata) => {
        // if metadata is sent back from the server, analyze and handle
        const keys = Object.keys(metadata._internal_repr);
        for (let i = 0; i < keys.length; i += 1) {
          const key = keys[i];
          reqResObj.response.headers[key] = metadata._internal_repr[key][0];
        }
        store.default.dispatch(actions.reqResUpdate(reqResObj));
      });

      for (let i = 0; i < queryArr.length; i++) {
        const query = queryArr[i];
        // Open Connection for client Stream
        // this needs additional work to provide correct sent time for each
        // request without overwrite
        const time = {};

        reqResObj.connection = "pending";

        time.timeSent = timeSent;
        reqResObj.response.times.push(time);

        //reqResObj.connectionType = 'plain';
        // reqResObj.timeSent = Date.now();

        call.write(query);
      }
      call.end();
    } else if (rpcType === "SERVER STREAM") {
      const timesArr = [];
      // Open Connection for SERVER Stream
      reqResObj.connection = "open";
      reqResObj.timeSent = Date.now();
      const call = client[rpc](reqResObj.queryArr[0], meta);
      call.on("data", (resp) => {
        const time = {};
        time.timeReceived = Date.now();
        time.timeSent = reqResObj.timeSent;
        // add server response to reqResObj and dispatch to state/store
        reqResObj.response.events.push(resp);
        reqResObj.response.times.push(time);
        reqResObj.timeReceived = time.timeReceived; //  overwritten on each call to get the final value

        store.default.dispatch(actions.reqResUpdate(reqResObj));
      });
      call.on("error", () => {
        // for fatal error from server
        console.log("server side stream erring out");
      });
      call.on("end", () => {
        // Close Connection for SERVER Stream
        reqResObj.connection = "closed";
        // no need to push response to reqResObj, no event expected from on 'end'
        store.default.dispatch(actions.reqResUpdate(reqResObj));
      });
      call.on("metadata", (metadata) => {
        const keys = Object.keys(metadata._internal_repr);
        for (let i = 0; i < keys.length; i += 1) {
          const key = keys[i];
          reqResObj.response.headers[key] = metadata._internal_repr[key][0];
        }
        store.default.dispatch(actions.reqResUpdate(reqResObj));
      });
    }
    //else BIDIRECTIONAL
    else {
      // Open duplex stream
      let counter = 0;
      const call = client[rpc](meta);
      call.on("data", (response) => {
        const curTimeObj = reqResObj.response.times[counter];
        counter++;
        //Close Individual Server Response for BIDIRECTIONAL Stream
        reqResObj.connection = "pending";
        curTimeObj.timeReceived = Date.now();
        reqResObj.timeReceived = curTimeObj.timeReceived;
        reqResObj.response.events.push(response);
        reqResObj.response.times.push(curTimeObj);
        store.default.dispatch(actions.reqResUpdate(reqResObj));
      }); // metadata from server
      call.on("metadata", (metadata) => {
        const keys = Object.keys(metadata._internal_repr);
        for (let i = 0; i < keys.length; i += 1) {
          const key = keys[i];
          reqResObj.response.headers[key] = metadata._internal_repr[key][0];
        }
        store.default.dispatch(actions.reqResUpdate(reqResObj));
      });
      call.on("error", () => {
        console.log("server ended connection with error");
      });
      call.on("end", (data) => {
        //Close Final Server Connection for BIDIRECTIONAL Stream
        reqResObj.connection = "closed";
        // no need to push response to reqResObj, no event expected from on 'end'
        store.default.dispatch(actions.reqResUpdate(reqResObj));
      });

      for (let i = 0; i < queryArr.length; i++) {
        const time = {};
        const query = queryArr[i];
        //Open Connection for BIDIRECTIONAL Stream
        if (i === 0) {
          reqResObj.connection = "open";
        } else {
          reqResObj.connection = "pending";
        }
        time.timeSent = Date.now();
        reqResObj.timeSent = time.timeSent;
        reqResObj.response.times.push(time);
        call.write(query);
      }
      call.end();
    }
    store.default.dispatch(actions.reqResUpdate(reqResObj));
    */
  });

  // send info to main to get client and meta
  api.send("fetch-meta-and-client", {
    reqResObj,
    rpcType,
  });
};
export default grpcController;
