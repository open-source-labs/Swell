var path = require('path')
const protoLoader = require('@grpc/proto-loader')
const grpc = require('grpc')


const PROTO_PATH = path.resolve(__dirname, './protos/hw2.proto')

const pd = protoLoader.loadSync(PROTO_PATH)
const loaded = grpc.loadPackageDefinition(pd)
const hello_proto = loaded.helloworld

function main () {
  var client = new hello_proto.Greeter('localhost:50051', grpc.credentials.createInsecure())
  var user
  if (process.argv.length >= 3) {
    user = process.argv[2]
  } else {
    user = 'world'
  }
  // unary
  client.sayHello({ name: user }, function (err, response) {
    console.log('Greeting:', response.message)
    })

  // server side streaming
  const call = client.sayHellos({ name: user })
    // testing with mock data in server.js
    call.on('data', data => {
      console.log('server streaming messages:', data);
    })
    // call.on('error', console.error);
    // call.on('data', console.log);
    // call.on('end', () => client.close());
    
  // client side streaming
  const stream = client.sayHelloCs((err, response) => {
    if (err) {
      console.log(err);
    } else {
      console.log(response);
    }
    client.close();
  })
  stream.write({ name: 'hello 1st client side stream'});
  stream.write({name: 'hello 2nd client side stream' })
  stream.end({ name: 'hello end client side stream'})
 
  // bidi streaming
  const streamBidi = client.sayHelloBidi();
  streamBidi.on('error', console.error);
  streamBidi.on('data', console.log);
  streamBidi.on('end', ()=> client.close());

  streamBidi.write ({ name: 'hello 1st bi-di stream'});
  streamBidi.end({ name: 'hello 2nd bi-di stream'})
}
main()