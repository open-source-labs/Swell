const fs =  require('fs');
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const { remote } = require('electron');
const path = require('path')

async function protoParser(protoBodyData) {
  // define storage for .proto parsed content
  let protoStorage = {};
  //store the original .proto content in the storage before parsing
  protoStorage.protoMaster = protoBodyData;

  // write to saveProto file for interaction with the server
  const dirName = remote.app.getAppPath();
  fs.writeFileSync(path.join(dirName, 'src/client/components/composer/protos/saveProto.proto'), protoBodyData, 'utf-8', (err) => {
    if(err){
      alert("An error ocurred writing the file :" + err.message);
      return;
    }
    console.log('Proto file has been saved')
  });

  // define the modular client for testing
  // declare path variable of imported proto file
  const PROTO_PATH = path.join(dirName, 'src/client/components/composer/protos/saveProto.proto');

  // create gRPC package options
  const protoOptionsObj = {
    keepCase : true,
    enums : String,
    longs :String,

  }
}
// services: [
//         {
//           name: 'BookService',
//           rpcs: [
//             {
//               name: 'GetBook',
//               type: 'UNARY',
//               definition: 'rpc GetBook (GetBookRequest) returns (Book) {}',
//               messages: [
//                 {
//                   name: 'Book',
//                   definition: [
//                     {
//                       number: 1,
//                       definition: 'int64 isbn = 1'
//                     },
//                     {
//                       number: 2,
//                       definition: 'string title = 2'
//                     },
//                     {
//                       number: 3,
//                       definition: 'string author = 3'
//                     }
//                   ]
//                 }
//               ]
//             }
