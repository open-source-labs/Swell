var path = require("path");
const protoLoader = require("@grpc/proto-loader");
const grpc = require("grpc");

const PROTO_PATH = path.resolve(__dirname, "./protos/hw2.proto");

const pd = protoLoader.loadSync(PROTO_PATH);
const loaded = grpc.loadPackageDefinition(pd);
const hello_proto = loaded.helloworld;

function main() {
  var client = new hello_proto.Greeter(
    "localhost:50051",
    grpc.credentials.createInsecure()
  );
  var user;
  if (process.argv.length >= 3) {
    user = process.argv[2];
  } else {
    user = "world";
  }
  
  const meta = new grpc.Metadata();
  meta.add("testing", "metadata is working");
  // client.sayHello.send({name: user}, meta, function(err, response) {
  //   console.log("metadata:", response);
  // });
  // unary
  client.sayHello({ name: user }, meta, function(err, response) {
    console.log("Greeting:", response.message);

  });
  // server side streaming
  const call = client.sayHellos({ name: user }, meta);
  call.on("data", data => {
    console.log("server streaming messages:", data);
  });

  // client side streaming
  const stream = client.sayHelloCs(meta, (err, response) => {
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
  const streamBidi = client.sayHelloBidi(meta);
  streamBidi.on("error", console.error);
  streamBidi.on("data", console.log);
  streamBidi.on("end", () => client.close());

  streamBidi.write ({ name: 'hello 1st bi-di stream'});
  streamBidi.end({ name: 'hello 2nd bi-di stream'})
}
main();
