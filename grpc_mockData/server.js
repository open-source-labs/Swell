<<<<<<< HEAD
const path = require('path')
const Mali = require('mali')
const hl = require('highland')
=======
const path = require("path");
const Mali = require("mali");
const hl = require("highland");
>>>>>>> dev

const PROTO_PATH = path.join(__dirname, "./protos/hw2.proto");
const HOSTPORT = "0.0.0.0:50051";

const dataStream = [
  {
    message: "Bob"
  },
  {
    message: "Kate"
  },
  {
    message: "Jim"
  },
  {
    message: "Sara"
  }
];

/**
 * Implements the SayHello RPC method.
 */
<<<<<<< HEAD
// unary response
async function sayHello (ctx) {
  console.dir(ctx.metadata, { depth: 3, colors: true })
  console.log(`got sayHello request name: ${ctx.req.name}`)
  ctx.res = { message: 'Hello ' + ctx.req.name }
  console.log(`set sayHello response: ${ctx.res.message}`)
}
// server side response
async function sayHellos (ctx) {
  console.dir(ctx.metadata, { depth: 3, colors: true })
  console.log(`got server side streaming request name: ${ctx.req.name}`)
  console.log('what is ctx.req.name', ctx.req.name)
  ctx.res = hl(streamData)
  // let counter = 0
  // ctx.res = hl('data', d => {
  //   counter++
    // ctx.res.write({ message: 'server side stream: ' + d.name })
  // })
  console.log(`done server side streaming`)
=======
function sayHello(ctx) {
  console.dir(ctx.metadata, { depth: 3, colors: true });
  console.log(`got sayHello request name: ${ctx.req.name}`);
  ctx.res = { message: "Hello " + ctx.req.name };
  console.log(`set sayHello response: ${ctx.res.message}`);
}

async function sayHellos(ctx) {
  console.dir(ctx.metadata, { depth: 3, colors: true });
  console.log(`got sayHellos request name:`, JSON.stringify(ctx.req, null, 4));
  let reqMessages = {"message": 'hello!!! ' + ctx.req.name}
  dataStream.push(reqMessages)
  reqMessages = dataStream
  console.log('what is this?????', reqMessages)
  let streamData = await hl(reqMessages)
  ctx.res = streamData;
  
  console.log(`done sayHellos`);
>>>>>>> dev
  ctx.res.end()
}

function sayHelloCs (ctx) {
  console.dir(ctx.metadata, { depth: 3, colors: true })
  console.log('got sayHelloClients')
  let counter = 0
  // console.log("ctx content:",ctx.req)
  return new Promise((resolve, reject) => {
    hl(ctx.req)
      .map(message => {
        counter++
        console.log('message content',message.name)
        ctx.response.res = { message: 'Client stream: ' + message.name }

      })
      .collect()
      .toCallback((err, result) => {
        if (err) return reject(err)
<<<<<<< HEAD
        console.log(`done client streaming counter ${counter}`)
        ctx.response.res = { message: 'client stream: ' + counter }
=======
        console.log(`done sayHelloClients counter ${counter}`)
        ctx.response.res = { message: 'SAYHELLOCs Client stream: ' + counter }
        console.log(ctx.response.res)
>>>>>>> dev
        resolve()
      })
  })
}

<<<<<<< HEAD
async function sayHelloBidi (ctx) {
  console.log('got sayHelloBidi')
  console.dir(ctx.metadata, { depth: 3, colors: true })
  let counter = 0
  ctx.req.on('data', d => {
    counter++
    ctx.res.write({ message: 'bi-di stream: ' + d.name })
  })
  ctx.req.on('end', () => {
    console.log(`done bi-di streaming counter ${counter}`)
    ctx.res.end()
  })
=======
function sayHelloBidi(ctx) {
  console.log("got sayHelloBidi");
  console.dir(ctx.metadata, { depth: 3, colors: true });
  let counter = 0;
  ctx.req.on("data", d => {
    counter++;
    ctx.res.write({ message: "bidi stream: " + d.name });
  });
  ctx.req.on("end", () => {
    console.log(`done sayHelloBidi counter ${counter}`);
    ctx.res.end();
  });
>>>>>>> dev
}

/**
 * Starts an RPC server that receives requests for the Greeter service at the
 * sample server port
 */
function main() {
  const app = new Mali(PROTO_PATH, "Greeter");
  app.use({ sayHello, sayHellos, sayHelloCs, sayHelloBidi });
  app.start(HOSTPORT);
  console.log(`Greeter service running @ ${HOSTPORT}`);
}

main();
