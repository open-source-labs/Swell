const path = require("path");
const hl = require("highland");
const Mali = require("mali");
// Mali needs the old grpc as a peer dependency so that should be installed as well
const grpc = require("@grpc/grpc-js");

// consider replacing highland with normal node code for converting array to streams

const PROTO_PATH = path.join(__dirname, "./protos/hw2.proto");
const HOSTPORT = "0.0.0.0:50051";

// Unary stream
// ctx = watch execution context
async function sayHello(ctx) {
  // ctx contains both req and res objects
  // sets key-value pair inside ctx.response.metadata as a replacement for headers
  ctx.set("UNARY", "true");
  ctx.res = { message: "Hello " + ctx.req.name };
  console.log(`set sayHello response from gRPC server: ${ctx.res.message}`);
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
  console.log(
    `set sayHelloNested response from gRPC server ${ctx.res.serverMessage[0]} ${ctx.res.serverMessage[1]}`
  );
}
// Server-Side Stream
// used highland library to manage asynchronous data
async function sayHellos(ctx) {
  ctx.set("SERVER-SIDE STREAM", "true");
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
  // research what await hl(array of objects) does
  const makeStreamData = await hl(updatedStream);
  ctx.res = makeStreamData;

  // ends server stream
  ctx.res.end();
}

// Client-Side stream
function sayHelloCs(ctx) {
  // create new metadata
  const metadata = new grpc.Metadata();
  metadata.set("it", "works?");
  metadata.set("indeed", "it do");
  metadata.set("clientStream", "indubitably");
  // The execution context provides scripts and templates with access to the watch metadata
  console.dir(ctx.metadata, { depth: 3, colors: true });
  // console.log('got sayHelloClients')
  let counter = 0;
  const messages = [];
  // client streaming calls to write messages and end writing before you can get the response
  return new Promise((resolve, reject) => {
    hl(ctx.req)
      .map((message) => {
        counter++;
        // console.log('message content',message.name)
        ctx.response.res = { message: "Client stream: " + message.name };
        messages.push(message.name);
        ctx.sendMetadata(metadata);
      })
      // returns all the elements as an array
      .collect()
      .toCallback((err, result) => {
        if (err) return reject(err);
        // console.log(`done sayHelloClients counter ${counter}`)
        ctx.response.res = { message: "SAYHELLOCs Client stream: " + messages };
        // console.log(ctx.response.res)
        resolve();
      });
  });
}

// Bi-Di stream
function sayHelloBidi(ctx) {
  // create new metadata
  const metadata = new grpc.Metadata();
  metadata.set("it", "works?");
  metadata.set("indeed", "it do");
  // console.log("got sayHelloBidi");
  // The execution context provides scripts and templates with access to the watch metadata
  console.dir(ctx.metadata, { depth: 3, colors: true });
  let counter = 0;
  ctx.req.on("data", (d) => {
    counter++;
    ctx.res.write({ message: "bidi stream: " + d.name });
  });
  metadata.set("bidiStream", "ohyes");
  ctx.sendMetadata(metadata);
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
  app.use({ sayHello, sayHelloNested, sayHellos, sayHelloCs, sayHelloBidi });
  app.start(HOSTPORT);
  console.log(`Greeter service running @ ${HOSTPORT}`);
}

main();
