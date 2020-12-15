const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

// change PROTO_PATH to load a different mock proto file
const PROTO_PATH = path.resolve(__dirname, "./hw2.proto");
const PORT = "0.0.0.0:50051";

const SayHello = (call, callback) => {
  callback(null, { message: `Hello ${call.request.name}` });
};

const SayHelloNested = (call, callback) => {
  callback(null, {serverMessage: [
    { message: `Hello! ${call.request.firstPerson.name}`},
    { message: `Hello! ${call.request.secondPerson.name}`}
    ]
  });
};

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

const sayHelloBidi = (call, callback) => {
  let counter = 0;
  call.on('data', data => {
    counter += 1;
    call.write({ message: "bidi stream: " + data.name });
  })
  call.on('end', () => {
    // console.log(`done sayHelloBidi counter ${counter}`)
    call.end();
  })
};

function main(status) {
  const proto = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });
  const pkg = grpc.loadPackageDefinition(proto);
  let server;
  if (status === 'open') {
    server = new grpc.Server();
    server.addService(pkg.helloworld.Greeter.service, { SayHello, SayHelloNested, SayHellosSs, sayHelloCs, sayHelloBidi });

    server.bindAsync(PORT, grpc.ServerCredentials.createInsecure(), (port) => {
      server.start();
      console.log(`grpc server running on port ${PORT}`);
    });
  } 
}

module.exports = main