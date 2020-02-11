const fs =  require('fs');
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const uuid = require('uuid');

//temp for testing >>>>
// let tempData = fs.readFileSync(path.join(process.cwd(), 'grpc_mockData/protos/route_guide.proto'), 'utf-8')

  // fs.writeFileSync(path.join(process.cwd(), 'src/client/components/composer/protos/saveProto.proto'), tempData, 'utf-8')
  //   console.log('Proto file has been saved')
  // })
// });
// temp for testing ^^^^
async function protoParserFunc(protoBodyData) {
  // define storage for .proto parsed content
  let protoStorage = {};
  //store the original .proto content in the storage before parsing
  protoStorage.protoMaster = protoBodyData;
  //make unique protoID for file we are saving
  let protoID = Math.floor(Math.random() * 1000);
  //if file path for that ID already exists, increment the ID
  try {
    while (fs.existsSync('src/client/components/composer/protos/' + protoID + '.proto')) {
      //file exists
      protoID += 1;
    }
  } catch(err) {
    console.error(err)
  }
  // write to saveProto file for interaction with the server
  // const dirName = remote.app.getAppPath(); // uncomment when done testing above
  fs.writeFileSync(path.join(process.cwd(), 'src/client/components/composer/protos/' + protoID + '.proto'), protoBodyData, 'utf-8')
    console.log('Proto file has been saved')
  // });

  // define the modular client for testing
  // declare path variable of imported proto file
  const PROTO_PATH = path.join(process.cwd(), 'src/client/components/composer/protos/' + protoID + '.proto');

  // create gRPC package options
  const protoOptionsObj = {
    keepCase : true,
    enums : String,
    longs :String,
    defaults: true,
    oneofs:true
  };
  // console.log('before protoLoader');
  //create gRPC package definition w/ protoLoader
  protoStorage.packageDefinition = protoLoader.loadSync(PROTO_PATH, protoOptionsObj);
  // console.log('after protoLoader');
  //create descriptor from package packageDefinition
  //descriptor --> gRPC uses the Protobuf .proto file format to define your messages, services and some aspects of the code generation.
  protoStorage.descriptor = grpc.loadPackageDefinition(protoStorage.packageDefinition);
  // console.log(protoStorage.descriptor);
  protoStorage.packageName = Object.keys(protoStorage.descriptor)[0];
  // console.log('package name: ',protoStorage.packageName);
  protoStorage.descriptorDefinition = protoStorage.descriptor[protoStorage.packageName];
  // console.log('protoStorage.descriptorDefinition: ',protoStorage.descriptorDefinition);
  protoStorage.protoPath = PROTO_PATH;
  // console.log(PROTO_PATH);
  const serviceArr = [];
  for (let [serviceName, serviceDef] of Object.entries(protoStorage.descriptorDefinition)){
  if (typeof serviceDef === 'function') {
    // console.log('serviceName: ', serviceName);
    // console.log('serviceDef: ', serviceDef);
    const serviceObj = {};
    serviceObj.packageName = protoStorage.packageName;
    // console.log('serviceName, serviceDef: ', serviceName, serviceDef);
    serviceObj.name = serviceName;
    serviceObj.rpcs = [];
    serviceObj.messages = []
    let counter = 1;
    for (let [requestName, requestDef] of Object.entries(serviceDef.service)) {
      // console.log('counter: ', counter);
      counter++
      // console.log('requestName: ', requestName);
      // console.log('requestDef: ', requestDef);
      const streamingReq = requestDef.requestStream;
      const streamingRes = requestDef.responseStream;
      // console.log('streamingReq, streamingRes: ', streamingReq, streamingRes);
      let stream = 'UNARY';
      if (streamingReq) stream = 'CLIENT STREAM';
      if (streamingRes) stream = 'SERVER STREAM';
      if (streamingReq && streamingRes) stream = 'BIDIRECTIONAL';
      let messageNameReq = requestDef.requestType.type.name;
      let messageNameRes = requestDef.responseType.type.name;
      serviceObj.rpcs.push({
        name: requestName,
        type: stream,
        req: messageNameReq,
        res: messageNameRes
      });

      // console.log('serviceName: ', serviceName); // ServiceName
      // console.log('requestName: ', requestName); // RPC Request Name
      // console.log('requestDef: ', requestDef); // too much info
      let draftObj;
      requestDef.requestType.type.field.forEach((msgObj) => {
        let mName = msgObj.name;
        // let mType = msgObj.type;
        let bool = false;
        if (msgObj.type === 'TYPE_MESSAGE') bool = true;
        if (!draftObj) {
          draftObj = {
            name: messageNameReq,
            def: {},

          }
        }
        draftObj.def[mName] = {};
        draftObj.def[mName].type = msgObj.type ;
        draftObj.def[mName].nested = bool ;
        draftObj.def[mName].dependent = msgObj.typeName ;

        // {
        //   name: messageNameReq,
        //   def: {
        //     [mName]: {
        //       type:msgObj.type,
        //       nested: bool,
        //       dependent: msgObj.typeName}
        //     }
        // }


      })
      serviceObj.messages.push(draftObj)
      /*
      requestDef.responseType.type.field.forEach((msgObj) => {
        let mName = msgObj.name;
        // let mType = msgObj.type;
        let bool = false;
        if (msgObj.type === 'TYPE_MESSAGE') bool = true;

        serviceObj.messages.push({
          name: messageNameRes,
          def: {[mName]: msgObj.type},
          nested: bool,
          dependent: msgObj.typeName
        })
        // serviceObj.messages.def =
      })
      */ // not using the details of the response object since user will run
      // their own server

      // serviceObj[serviceName][requestName]
      // console.log('Request message type: ',requestDef.requestType.type); // need to iterate through .field to get all types per message
      // console.log('Request message name: ',requestDef.requestType.type.name); // Request message name
      // console.log('Request message type.field: ',requestDef.requestType.type.field);
      // console.log('message reqField [0].name: ', (requestDef.requestType.type.field)[0].name); // name of individual message field within message
      // console.log('message reqField [0].type: ', (requestDef.requestType.type.field)[0].type); // type of individual message field per message
      // console.log('Response message name: ',requestDef.responseType.type.name);// Response message name
      // console.log('Response message type.field: ',requestDef.responseType.type.field);
      // console.log('message resField [0].name: ', (requestDef.responseType.type.field)[0].name); // name of individual content type within message
      // console.log('message resField [0].type: ', (requestDef.responseType.type.field)[0].type);// type of individual content type per message

      // console.log('serviceObj: ', serviceObj);
      // console.log('serviceObj.messages: ', serviceObj.messages);
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
//this.state.services = [
// {name: 'ServiceName',
// messages: [{name: 'messageName',
//            def: {messageDef}
//            }]
// rpcs: [{name: 'RPC Name',
//         type: 'Stream Type',
//         req: 'MessageName for Requst',
//         res: 'MessageName for Response'}]
//  }]
//
// this.state.services: [
      //   {
      //     name: 'BookService',
      //     messages: [
      //       {
      //         name: "Book",
      //         def: {
      //           isbn: 'int64',
      //           title: 'string',
      //           author: 'string',
      //         }
      //       },
      //       {
      //         name: "GetBookRequest",
      //         def: {
      //           isbn: 'int64'
      //         }
      //       },
      //       {
      //         name: "GetBookViaAuthor",
      //         def: {
      //           author: 'string',
      //         }
      //       }
      //     ],
      //     rpcs: [
      //       {
      //         name: "GetBook",
      //         type: 'UNARY',
      //         req: 'GetBookRequest',
      //         res: 'Book'
      //       },
      //       {
      //         name: "GetBooksViaAuthor",
      //         type: 'SERVER STREAM',
      //         req: 'GetBookViaAuthor',
      //         res: 'Book'
      //       },
      //       {
      //         name: "GetGreatestBook",
      //         type: 'CLIENT STREAM',
      //         req: 'GetBookRequest',
      //         res: 'Book'
      //       },
      //       {
      //         name: "GetBooks",
      //         type: 'BIDIRECTIONAL',
      //         req: 'GetBookRequest',
      //         res: 'Book'
      //       },
      //     ]
      //   },
      //   {
      //     name: 'DogService',
      //     messages: [
      //       {
      //         name: "Info",
      //         def: {
      //           name: 'string',
      //           breed: 'string'
      //         }
      //       },
      //       {
      //         name: "GetAge",
      //         def: {
      //           age: 'string'
      //         }
      //       }
      //     ],
      //     rpcs: [
      //       {
      //         name: "GetInfo",
      //         type: 'UNARY',
      //         req: 'GetAge',
      //         res: 'Info',
      //       },
      //       {
      //         name: "GetBackground",
      //         type: 'BIDIRECTIONAL',
      //         req: 'GetAge',
      //         res: 'Info'
      //       },
      //     ]
      //   }
      // ]
// console.log(tempData);
// protoParserFunc(tempData).catch((err) => console.log(err));
export default protoParserFunc
