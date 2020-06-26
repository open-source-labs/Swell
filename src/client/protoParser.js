const fs = require("fs");
const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const uuid = require("uuid");

async function protoParserFunc(protoBodyData) {
  // define storage for .proto parsed content
  let protoStorage = {};
  //store the original .proto content in the storage before parsing
  protoStorage.protoMaster = protoBodyData;
  //make unique protoID for file we are saving
  let protoID = Math.floor(Math.random() * 10000);
  //if file path for that ID already exists, increment the ID
  try {
    if (!fs.existsSync(path.join(process.resourcesPath, "/protos/"))) {
      fs.mkdirSync(path.join(process.resourcesPath, "/protos/"));
    }
  } catch (err) {
    console.error(err);
  }

  try {
    while (
      fs.existsSync(
        path.join(process.resourcesPath, "/protos/" + protoID + ".proto")
      )
    ) {
      //if file name exists try incrementing by 1
      protoID += 1;
    }
  } catch (err) {
    console.error(err);
  }
  // const dirName = remote.app.getAppPath(); // remote.app.getAppPath() stopped working at some point so switched to process.resourcesPath

  // write to saveProto file for interaction with the server
  fs.writeFileSync(
    path.join(process.resourcesPath, "/protos/" + protoID + ".proto"),
    protoBodyData,
    "utf-8"
  );

  // define the modular client for testing
  // declare path variable of imported proto file

  const PROTO_PATH = path.join(
    process.resourcesPath,
    "/protos/" + protoID + ".proto"
  );

  // create gRPC package options
  const protoOptionsObj = {
    keepCase: true,
    enums: String,
    longs: String,
    defaults: true,
    oneofs: true,
  };

  //create gRPC package definition w/ protoLoader library
  protoStorage.packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    protoOptionsObj
  );

  //create descriptor from package packageDefinition
  //descriptor --> gRPC uses the Protobuf .proto file format to define your messages, services and some aspects of the code generation.
  protoStorage.descriptor = grpc.loadPackageDefinition(
    protoStorage.packageDefinition
  );
  protoStorage.packageName = Object.keys(protoStorage.descriptor)[0];
  protoStorage.descriptorDefinition =
    protoStorage.descriptor[protoStorage.packageName];
  protoStorage.protoPath = PROTO_PATH;

  // Store the services from the current .proto file
  const serviceArr = [];
  for (let [serviceName, serviceDef] of Object.entries(
    protoStorage.descriptorDefinition
  )) {
    if (typeof serviceDef === "function") {
      const serviceObj = {};
      serviceObj.packageName = protoStorage.packageName;
      serviceObj.name = serviceName;
      serviceObj.rpcs = [];
      serviceObj.messages = [];

      for (let [requestName, requestDef] of Object.entries(
        serviceDef.service
      )) {
        const streamingReq = requestDef.requestStream;
        const streamingRes = requestDef.responseStream;

        let stream = "UNARY";
        if (streamingReq) stream = "CLIENT STREAM";
        if (streamingRes) stream = "SERVER STREAM";
        if (streamingReq && streamingRes) stream = "BIDIRECTIONAL";
        let messageNameReq = requestDef.requestType.type.name;
        let messageNameRes = requestDef.responseType.type.name;
        serviceObj.rpcs.push({
          name: requestName,
          type: stream,
          req: messageNameReq,
          res: messageNameRes,
        });

        // create object with proto info that is formatted for interaction with Swell frontend
        let draftObj;
        requestDef.requestType.type.field.forEach((msgObj) => {
          let mName = msgObj.name;
          // bool will track if the message is a nested type
          let bool = false;
          if (msgObj.type === "TYPE_MESSAGE") bool = true;
          if (!draftObj) {
            draftObj = {
              name: messageNameReq,
              def: {},
            };
          }
          draftObj.def[mName] = {};
          draftObj.def[mName].type = msgObj.type;
          draftObj.def[mName].nested = bool;
          draftObj.def[mName].dependent = msgObj.typeName;

          // Frontend expects a message object in the following format
          // {
          //   name: messageNameReq,
          //   def: {
          //     [mName]: {
          //       type:msgObj.type,
          //       nested: bool,
          //       dependent: msgObj.typeName}
          //     }
          // }
        });
        serviceObj.messages.push(draftObj);

        // not using the details of the response object (requestDef.responseType) since user will run
        // their own server
      }
      serviceArr.push(serviceObj);
    }
  }
  protoStorage.serviceArr = serviceArr;
  return protoStorage;
}
// test run of protoParser
// protoParser(tempData);
//
//current target shape of parsed grpc service object for frontend
//this.state.services = [
// {name: 'ServiceName',
// messages: [{
//   name: messageNameReq,
//   def: {
//     [mName]: {
//       type:msgObj.type,
//       nested: bool,
//       dependent: msgObj.typeName}
//     }
// }]
// rpcs: [{name: 'RPC Name',
//         type: 'Stream Type',
//         req: 'MessageName for Requst',
//         res: 'MessageName for Response'}]
//  }]
//

// console.log(tempData);
// protoParserFunc(tempData).catch((err) => console.log(err));
export default protoParserFunc;
