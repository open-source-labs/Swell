
const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

// change PROTO_PATH to load a different mock proto file
const PROTO_PATH = path.resolve(__dirname, "./hw2.proto");
const PORT = "0.0.0.0:50051";

// rpc SayHello (HelloRequest) returns (HelloReply) {}
// rpc SayHelloNested (HelloNestedRequest) returns (HelloNestedReply) {}
// rpc SayHellosSs (HelloRequest) returns (stream HelloReply) {}
// rpc SayHelloCS (stream HelloRequest) returns (HelloReply) {}
// rpc SayHelloBidi (stream HelloRequest) returns (stream HelloReply) {}

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
  //   const messages = [];
  
  //   return new Promise((resolve, reject) => {
  //     // ctx.req is the incoming readable stream
  //     hl(ctx.req)
  //       .map((message) => {
  //         // currently the proto file is setup to only read streams with the key "name"
  //         // other named keys will be pushed as an empty object
  //         messages.push(message);
  //         return undefined;
  //       })
  //       .collect()
  //       .toCallback((err, result) => {
  //         if (err) return reject(err);
  //         ctx.response.res = { message: `received ${messages.length} messages` };
  //         return resolve();
  //       });
  //   });



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
    server.addService(pkg.helloworld.Greeter.service, { SayHello, SayHelloNested, SayHellosSs, sayHelloCs });

    server.bindAsync(PORT, grpc.ServerCredentials.createInsecure(), (port) => {
      server.start();
      console.log(`grpc server running on port ${PORT}`);
    });
  } 
}

main("open");

module.exports = main

// // Client-Side stream
// async function sayHelloCs(ctx) {
//   // create new metadata
//   ctx.set("client-side-stream", "true");

//   const messages = [];

//   return new Promise((resolve, reject) => {
//     // ctx.req is the incoming readable stream
//     hl(ctx.req)
//       .map((message) => {
//         // currently the proto file is setup to only read streams with the key "name"
//         // other named keys will be pushed as an empty object
//         messages.push(message);
//         return undefined;
//       })
//       .collect()
//       .toCallback((err, result) => {
//         if (err) return reject(err);
//         ctx.response.res = { message: `received ${messages.length} messages` };
//         return resolve();
//       });
//   });
// }

// // Bi-Di stream
// function sayHelloBidi(ctx) {
//   // create new metadata
//   ctx.set("bidi-stream", "true");
//   // The execution context provides scripts and templates with access to the watch metadata
//   let counter = 0;
//   ctx.req.on("data", (data) => {
//     counter++;
//     ctx.res.write({ message: "bidi stream: " + data.name });
//   });

//   // calls end to client before closing server
//   ctx.req.on("end", () => {
//     // console.log(`done sayHelloBidi counter ${counter}`);
//     // ends server stream
//     ctx.res.end();
//   });
// }

// /**
//  * Starts an RPC server that receives requests for the Greeter service at the
//  * sample server port
//  */
// function main(status) {
//   const app = new Mali(PROTO_PATH, "Greeter");
//   if (status === 'open') {
//     app.use({ sayHello, sayHelloNested, sayHellosSs, sayHelloCs, sayHelloBidi });
//     app.start(HOSTPORT);
//     console.log(`GRPC Greeter service running @ ${HOSTPORT}`);
//   } else if (status === 'close') {
//     app.close();
//     console.log('grpcServer closed')
//   }
// }

// main("open");

// module.exports = main
