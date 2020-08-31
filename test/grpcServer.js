const path = require("path");
const fs = require("fs");
const hl = require("highland");
const Mali = require("mali");
// Mali needs the old grpc as a peer dependency so that should be installed as well
const grpc = require("@grpc/grpc-js");

// consider replacing highland with normal node code for converting array to streams

const PROTO_PATH = path.join(__dirname, "./hw2.proto");
const HOSTPORT = "0.0.0.0:50051";

// Unary stream
// ctx = watch execution context
async function sayHello(ctx) {
  // ctx contains both req and res objects
  // sets key-value pair inside ctx.response.metadata as a replacement for headers
  ctx.set("UNARY", "true");
  ctx.res = { message: "Hello " + ctx.req.name };
}
// nested Unary stream
async function sayHelloNested(ctx) {
  ctx.set("UNARY", "true");
  // nested unary response call
  const firstPerson = ctx.req.firstPerson.name;
  const secondPerson = ctx.req.secondPerson.name;
  ctx.res = {
    serverMessage: [
      { message: "Hello! " + firstPerson },
      { message: "Hello! " + secondPerson },
    ],
  };
}
// Server-Side Stream
// used highland library to manage asynchronous data
async function sayHellosSs(ctx) {
  ctx.set("Server-side-stream", "true");
  // In case of UNARY and RESPONSE_STREAM calls it is simply the gRPC call's request

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

  const reqMessages = { message: "hello!!! " + ctx.req.name };
  // combine template with reqMessage
  const updatedStream = [...dataStream, reqMessages];
  const makeStreamData = await hl(updatedStream);
  ctx.res = makeStreamData;
  // ends server stream
  ctx.res.end();
}

// Client-Side stream
async function sayHelloCs(ctx) {
  // create new metadata
  ctx.set("client-side-stream", "true");

  const messages = [];

  return new Promise((resolve, reject) => {
    // ctx.req is the incoming readable stream
    hl(ctx.req)
      .map((message) => {
        // currently the proto file is setup to only read streams with the key "name"
        // other named keys will be pushed as an empty object
        messages.push(message);
        return undefined;
      })
      .collect()
      .toCallback((err, result) => {
        if (err) return reject(err);
        ctx.response.res = { message: `received ${messages.length} messages` };
        return resolve();
      });
  });
}

// Bi-Di stream
function sayHelloBidi(ctx) {
  // create new metadata
  ctx.set("bidi-stream", "true");
  // The execution context provides scripts and templates with access to the watch metadata
  let counter = 0;
  ctx.req.on("data", (data) => {
    counter++;
    ctx.res.write({ message: "bidi stream: " + data.name });
  });

  // calls end to client before closing server
  ctx.req.on("end", () => {
    // console.log(`done sayHelloBidi counter ${counter}`);
    // ends server stream
    ctx.res.end();
  });
}

/**
 * Starts an RPC server that receives requests for the Greeter service at the
 * sample server port
 */
function main() {
  const app = new Mali(PROTO_PATH, "Greeter");
  app.use({ sayHello, sayHelloNested, sayHellosSs, sayHelloCs, sayHelloBidi });
  app.start(HOSTPORT);
  console.log(`GRPC Greeter service running @ ${HOSTPORT}`);
}

main();
