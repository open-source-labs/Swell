const fs =  require('fs');
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
// const electron = require('electron');
// import { ipcRenderer } from "electron";
// const { remote } = require('electron');
// const app = require('electron').remote.app;
// import { remote } from 'electron';
const path = require('path')

//temp for testing >>>>
// console.log(electron);
// console.log(__dirname);
// console.log('app.getAppPath(): ', remote.app.getAppPath());
// console.log(path.join(__dirname, 'grpc_mockData/protos/hw2.proto'));
// console.log(path.join(process.cwd(), 'grpc_mockData/protos/hw2.proto'));
// console.log(path);
// const dirName = remote.app.getAppPath();
// console.log(process.cwd());
let tempData = fs.readFileSync(path.join(process.cwd(), 'grpc_mockData/protos/hw2.proto'), 'utf-8')
  // tempData = data;
  console.log('data: ', tempData);
  // write to saveProto file
  // const dirName = remote.app.getAppPath();
  fs.writeFileSync(path.join(process.cwd(), 'src/client/components/composer/protos/saveProto.proto'), tempData, 'utf-8')
    console.log('Proto file has been saved')
  // })
// });
// temp for testing ^^^^
async function protoParser(protoBodyData) {
  // define storage for .proto parsed content
  let protoStorage = {};
  //store the original .proto content in the storage before parsing
  protoStorage.protoMaster = protoBodyData;

  // write to saveProto file for interaction with the server
  // const dirName = remote.app.getAppPath(); // uncomment when done testing above
  fs.writeFileSync(path.join(process.cwd(), 'src/client/components/composer/protos/saveProto.proto'), protoBodyData, 'utf-8')
    console.log('Proto file has been saved')
  // });

  // define the modular client for testing
  // declare path variable of imported proto file
  const PROTO_PATH = path.join(process.cwd(), 'src/client/components/composer/protos/saveProto.proto');

  // create gRPC package options
  const protoOptionsObj = {
    keepCase : true,
    enums : String,
    longs :String,
    defaults: true,
    oneofs:true
  };
  console.log('before protoLoader');
  //create gRPC package definition w/ protoLoader
  protoStorage.packageDefinition = protoLoader.loadSync(PROTO_PATH, protoOptionsObj);
  console.log('after protoLoader');
  //create descriptor from package packageDefinition
  //descriptor --> gRPC uses the Protobuf .proto file format to define your messages, services and some aspects of the code generation.
  protoStorage.descriptor = grpc.loadPackageDefinition(protoStorage.packageDefinition);
  // console.log(protoStorage.descriptor);
  protoStorage.packageName = Object.keys(protoStorage.descriptor)[0];
  // console.log('package name: ',protoStorage.packageName);
  protoStorage.descriptorDefinition = protoStorage.descriptor[protoStorage.packageName];
  // console.log('protoStorage.descriptorDefinition: ',protoStorage.descriptorDefinition);
  rpcObj = {};

}
// test run of protoParser
// protoParser(tempData);

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
console.log(tempData);
protoParser(tempData).catch((err) => console.log(err));
module.exports = {
  protoParser
};
