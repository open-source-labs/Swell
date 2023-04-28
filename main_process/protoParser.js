// this file is being required into main. this function, protoParserFunc, 
// should only be called inside main.

const fs = require('fs');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

async function protoParserFunc(protoBodyData) {
  // define storage for .proto parsed content
  const protoStorage = {};

  // store the original .proto content in the storage before parsing
  protoStorage.protoMaster = protoBodyData;

  // make unique protoID for file we are saving
  let protoID = Math.floor(Math.random() * 10000);

  // if file path for that ID already exists, increment the ID
  try {
    if (!fs.existsSync(path.join(process.resourcesPath, '/protos/'))) {
      fs.mkdirSync(path.join(process.resourcesPath, '/protos/'));
    }
  } catch (err) {
    console.error(err);
  }

  try {
    while (
      fs.existsSync(
        path.join(process.resourcesPath, `/protos/${protoID}.proto`)
      )
    ) {
      // if file name exists try incrementing by 1
      protoID += 1;
    }
  } catch (err) {
    console.error(err);
  }

  // write to saveProto file for interaction with the server
  fs.writeFileSync(
    path.join(process.resourcesPath, `/protos/${protoID}.proto`),
    protoBodyData,
    'utf-8'
  );

  // define the modular client for testing
  // declare path variable of imported proto file
  const PROTO_PATH = path.join(
    process.resourcesPath,
    `/protos/${protoID}.proto`
  );
  // store the proto Path on proto storage object
  protoStorage.protoPath = PROTO_PATH;

  // create gRPC package options
  const protoOptionsObj = {
    keepCase: true,
    enums: String,
    longs: String,
    defaults: true,
    oneofs: true,
  };

  // create gRPC package definition w/ protoLoader library
  protoStorage.packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    protoOptionsObj
  );

  // create descriptor from package packageDefinition
  // descriptor --> gRPC uses the Protobuf .proto file format to define your messages, services and some aspects of the code generation.
  protoStorage.descriptor = grpc.loadPackageDefinition(
    protoStorage.packageDefinition
  );
  protoStorage.packageName = Object.keys(protoStorage.descriptor)[0];

  // a recursive helper function to find our service definition. if it's nested, we need to find the actual rpc data
  const findNestedService = (obj) => {
    if (Object.values(obj).length > 1) return obj; // otherwise...
    return findNestedService(Object.values(obj)[0]);
  };
  // invoke the function to add our rpc data onto our protoStorage object
  protoStorage.descriptorDefinition = findNestedService(
    protoStorage.descriptor
  );

  // Store the services from the current .proto file
  const serviceArr = [];

  for (const [serviceName, serviceDef] of Object.entries(
    protoStorage.descriptorDefinition
  )) {
    if (typeof serviceDef === 'function') {
      // here a service is defined.
      const serviceObj = {};
      serviceObj.packageName = protoStorage.packageName;
      serviceObj.name = serviceName;
      serviceObj.rpcs = [];
      serviceObj.messages = [];

      for (const [requestName, requestDef] of Object.entries(
        serviceDef.service
      )) {
        const streamingReq = requestDef.requestStream;
        const streamingRes = requestDef.responseStream;

        let stream = 'UNARY';
        if (streamingReq) stream = 'CLIENT STREAM';
        if (streamingRes) stream = 'SERVER STREAM';
        if (streamingReq && streamingRes) stream = 'BIDIRECTIONAL';
        const messageNameReq = requestDef.requestType.type.name;
        const messageNameRes = requestDef.responseType.type.name;
        serviceObj.rpcs.push({
          name: requestName,
          type: stream,
          req: messageNameReq,
          res: messageNameRes,
        });

        // create object with proto info that is formatted for interaction with Swell frontend
        let draftObj;
        requestDef.requestType.type.field.forEach((msgObj) => {
          const mName = msgObj.name;
          // bool will track if the message is a nested type
          let bool = false;
          if (msgObj.type === 'TYPE_MESSAGE') bool = true;
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
  // console.log('service array length - is this ever more than 1?', serviceArr.length)
  protoStorage.serviceArr = serviceArr;

  return protoStorage || 'Error: please enter valid .proto file';
}

module.exports = protoParserFunc;
