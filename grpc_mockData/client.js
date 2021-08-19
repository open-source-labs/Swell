const path = require('path');
const protoLoader = require('@grpc/proto-loader');
const grpc = require('@grpc/grpc-js');

// store proto path
const PROTO_PATH = path.resolve(__dirname, './protos/hw2.proto');

// create package definition
const pd = protoLoader.loadSync(PROTO_PATH);
const loaded = grpc.loadPackageDefinition(pd);
// store package from proto file
const helloProto = loaded.helloworld;

function main() {
  // start client and create credentials
  const client = new helloProto.Greeter(
    'localhost:50051',
    grpc.credentials.createInsecure()
  );
  // set request value
  // CLI prompt or hard code the variable for the message "name": "string"
  let user;
  // returns an array containing the command line arguments passed when the Node.js process was launched
  // starts on 2 because process.argv contains the whole command-line invocation
  // argv[0] and argv[1] will be node example.js
  if (process.argv.length >= 3) {
    user = process.argv[2];
  } else {
    user = 'world';
  }

  // create metadata
  const meta = new grpc.Metadata();
  meta.add('testing', 'metadata is working');

  // unary
  client.sayHello({ name: user }, meta, (err, response) => {
    console.log('Greeting:', response.message);
  });
  // server side streaming
  const call = client.sayHellos({ name: user }, meta);
  call.on('data', (data) => {
    console.log('server streaming messages:', data);
  });

  // client side streaming
  const stream = client.sayHelloCs(meta, (err, response) => {
    if (err) {
      console.log(err);
    } else {
      console.log(response);
    }
    client.close();
  });
  stream.write({ name: 'hello 1st client side stream' });
  stream.write({ name: 'hello 2nd client side stream' });
  // ends client streaming
  stream.end({ name: 'hello end client side stream' });

  // bidi streaming
  const streamBidi = client.sayHelloBidi(meta);
  // reads streaming data
  streamBidi.on('error', console.error);
  streamBidi.on('data', console.log);
  streamBidi.on('end', () => client.close());
  // write data
  streamBidi.write({ name: 'hello 1st bi-di stream' });
  // ends data
  streamBidi.end({ name: 'hello 2nd bi-di stream' });
}
main();
