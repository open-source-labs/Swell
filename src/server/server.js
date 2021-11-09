const path = require('path');
const express = require('express');
const ngrok = require('ngrok');

const port = 3000;
const app = express();

//websocket stuff
// const ws = require('ws');
const server = require('http').createServer(app); 
const io = require('socket.io')(server, {
  cors: {
    origin: '*'
  }
});


io.on('connection', (client)=>{
  console.log('established websocket connection');

  client.on('message', (message) => {
    console.log('message received: ', message);
    //   ngrok
    // .connect({
    //   proto: 'http',
    //   addr: '3000',
    // })
    // .then((url) => {
    //   console.log(`ngrok tunnel opened at: ${url}/webhook`);
    //   return res.status(200).json(url);
    // });
  });
});

app.get('/', (req, res) => res.send('Hello World!'));

app.use(express.static(path.resolve(__dirname, '../../build')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/webhookServer', (req, res) => {
  console.log('Server Is On!');
  ngrok
    .connect({
      proto: 'http',
      addr: '3000',
    })
    .then((url) => {
      console.log(`ngrok tunnel opened at: ${url}/webhook`);
      return res.status(200).json(url);
    });
  // return res.status(200).json('Hi! I am a test!');
});

app.delete('/webhookServer', (req, res) => {
  console.log('Server Is Off!');
  ngrok.kill();
  return res.status(200).json('the server has been deleted');
});

// listening for stuff
app.post('/webhook', (req, res)=> {
  console.log(req.body);
  return res.status(200).json('WE DID IT!?');
})

app.get('*', (req, res) => {
  console.log('helooooo');
  // res.status(200).sendFile(path.join(__dirname, '../index.js'));
  // res.status(200).sendFile(path.join(__dirname,'../../index-csp.html'))
});

// //inital error handler, needs work
app.use('*', (req,res) => {
  res.status(404).send('Not Found');
});

//Global Handler, needs work
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errObj = {...defaultErr, ...err}
  // const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

// need to make this work somehow

// module.exports = app.listen(port, () => console.log(`Listening on port ${port}`));
module.exports = server.listen(port, () => console.log(`Listening on port ${port}`));