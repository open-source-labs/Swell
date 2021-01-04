const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

// change PROTO_PATH to load a different mock proto file
const PROTO_PATH = path.resolve(__dirname, "./hw2.proto");
const PORT = "0.0.0.0:30051";

// Service method to be used on unary test
const SayHello = (call, callback) => {
  callback(null, { message: `Hello ${call.request.name}` });
};

// Service method to be used on nested unary test
const SayHelloNested = (call, callback) => {
  callback(null, {serverMessage: [
    { message: `Hello! ${call.request.firstPerson.name}`},
    { message: `Hello! ${call.request.secondPerson.name}`}
    ]
  });
};

// Service method to be used on server streaming test
const SayHellosSs = call => {
  const dataStream = [
    {
      message: "You",
    },
    {
      message: "Are",
    },
    {
      message: "doing IT",
    },
    {
      message: "Champ",
    },
  ];
  const reqMessage = { message: "hello!!! " + call.request.name}
  const updatedStream = [...dataStream, reqMessage];
  updatedStream.forEach(data => {
    call.write(data)
  })
  call.end();
};

// Service method to be used on client streaming test
const sayHelloCs = (call, callback) => {
  const messages = [];
  call.on('data', data => {
    messages.push(data);
  })
  call.on('end', () => {
    callback(null, {
      message: `received ${messages.length} messages`
    })
  })
};

// Service method to be used on bidirectional streaming test
const sayHelloBidi = (call, callback) => {
  call.on('data', data => {
    call.write({ message: "bidi stream: " + data.name });
  })
  call.on('end', () => {
    call.end();
  })
};

// function for starting a gRPC test server
function main(status) {
  // load proto file
  const proto = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });
  const pkg = grpc.loadPackageDefinition(proto);
  if (status === 'open') {
    // create new instance of grpc server
    const server = new grpc.Server();

    // add service and methods to the server
    server.addService(pkg.helloworld.Greeter.service, { SayHello, SayHelloNested, SayHellosSs, sayHelloCs, sayHelloBidi });

    // bind specific port to the server and start the server
    server.bindAsync(PORT, grpc.ServerCredentials.createInsecure(), (port) => {
      server.start();
      console.log(`grpc server running on port ${PORT}`);
    });
  }
}
main('open');
module.exports = main;
