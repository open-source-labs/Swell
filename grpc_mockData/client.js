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
    call.on('data', data => {
      console.log('server streaming messages:', data);
    })

  // client side streaming
  const stream = client.sayHelloCs((err, response) => {
    if (err) {
      console.log(err);
    } else {
      console.log(response);
    }
    // client.close();
  })
  stream.write({ name: 'hello write stream'});
  stream.write({name: 'hello 2nd stream' })
  stream.end({ name: 'hello end stream'})
 
  // bidi streaming
  const streamBidi = client.sayHelloBidi();
  streamBidi.on('error', console.error);
  streamBidi.on('data', console.log);
  streamBidi.on('end', ()=> client.close());

  streamBidi.write ({ name: 'hello bidi stream 1'});
  streamBidi.end({ name: 'hello bidi stream 2'})
}
main()