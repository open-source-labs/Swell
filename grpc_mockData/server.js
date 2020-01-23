const path = require('path')
const Mali = require('mali')
const hl = require('highland')
const fs = require('fs')
JSONStream = require('JSONStream')

const PROTO_PATH = path.join(__dirname, './protos/hw2.proto')
const HOSTPORT = '0.0.0.0:50051'

const streamData = [{
  message: 'Hello Bob'
},
{
  message: 'Hello Kate'
},
{
  message: 'Hello Jim'
},
{
  message: 'Hello Sara'
}
]

/**
 * Implements the SayHello RPC method.
 */
async function sayHello (ctx) {
  console.dir(ctx.metadata, { depth: 3, colors: true })
  console.log(`got sayHello request name: ${ctx.req.name}`)
  ctx.res = { message: 'Hello ' + ctx.req.name }
  console.log(`set sayHello response: ${ctx.res.message}`)
}

async function sayHellos (ctx) {
  console.dir(ctx.metadata, { depth: 3, colors: true })
  console.log(`got sayHellos request name: ${ctx.req.name}`)
  ctx.res = hl(streamData)
  console.log(`done sayHellos`)
}

async function sayHelloCs (ctx) {
  console.dir(ctx.metadata, { depth: 3, colors: true })
  console.log('got sayHelloClients')
  let counter = 0
  // console.log("ctx content:",ctx.req)
  return new Promise((resolve, reject) => {
    hl(ctx.req)
      .map(message => {
        counter++
        console.log('message content',message.name)
        if (message && message.name) {
          return message.name.toUpperCase()
        }
        return ''
      })
      .collect()
      .toCallback((err, result) => {
        if (err) return reject(err)
        console.log(`done sayHelloClients counter ${counter}`)
        ctx.response.res = { message: 'Client stream: ' + counter }
        resolve()
      })
  })
}

async function sayHelloBidi (ctx) {
  console.log('got sayHelloBidi')
  console.dir(ctx.metadata, { depth: 3, colors: true })
  let counter = 0
  ctx.req.on('data', d => {
    counter++
    ctx.res.write({ message: 'bidi stream: ' + d.name })
  })
  ctx.req.on('end', () => {
    console.log(`done sayHelloBidi counter ${counter}`)
    ctx.res.end()
  })
}

/**
 * Starts an RPC server that receives requests for the Greeter service at the
 * sample server port
 */
function main () {
  const app = new Mali(PROTO_PATH, 'Greeter')
  app.use({ sayHello, sayHellos, sayHelloCs, sayHelloBidi })
  app.start(HOSTPORT)
  console.log(`Greeter service running @ ${HOSTPORT}`)
}

main()