
const { ipcMain }  = require('electron');
const EventSource = require('eventsource');
const fetch = require('node-fetch');
const http = require('http');

const SSEController = {};

let sse; 

SSEController.testing = (url, reqResObj, event) => {
  // console.log('event before function :', event)
  console.log('reqresobj : ', reqResObj)
  let counter = 0; 
  sse = new EventSource(url); 
  console.log('fired!!')
  sse.onopen = () => console.log('opened bitch!');
  sse.onmessage = (message) => {
    const newMessage = { ...message };
    newMessage.timeReceived = Date.now(); 
    // FIX THIS LATER!!!
    if (!reqResObj.response.events) reqResObj.response.events = []; 
    reqResObj.response.events.push(newMessage);
    reqResObj.response.headers = {};
    reqResObj.connection = 'initialized';
    reqResObj.response.headers['content-type'] = 'text/event-stream'
    console.log('created this : ', reqResObj.response)
    event.sender.send('reqResUpdate', reqResObj);
    counter++; 
    if (counter === 5) sse.close(); 
  }; 
  // http.get(url, {
  //   agent: false
  // }, (res) => {
  //   res.on('data', (chunk) => {
  //     console.log(res.headers)
  //     event.sender.send('testing-SSE', chunk.toString()); 
  //   })
  // })
}

SSEController.createStream = (reqResObj, options, event) => {
  
  const { headers } = options;
  const startTime = Date.now(); 

  http.get(headers.url, {
    headers,
    agent: false,
  }, (res) => {
    console.log('res is : ', res)
    reqResObj.response.headers = {...res.headers};
    reqResObj.connection = 'open'; 
    reqResObj.connectionType = 'SSE';
    SSEController.readStream(reqResObj, event, Date.now() - startTime);
    // res.on('data', (chunk) => {
    //   console.log(res.headers)
    //   event.sender.send('testing-SSE', chunk.toString()); 
    // });
  });
};

SSEController.readStream = (reqResObj, event, timeDiff) => {
  sse = new EventSource(reqResObj.url); 
  console.log('fired!!')
  sse.onopen = () => console.log('opened!');
  sse.onmessage = (message) => {
    const newMessage = { ...message };
    newMessage.timeReceived = Date.now() - timeDiff; 
    // FIX THIS LATER!!!
    reqResObj.response.events.push(newMessage);
    // console.log('created this : ', newMessage.data, newMessage.timeReceived)
    event.sender.send('reqResUpdate', reqResObj);
  }; 
}

// module.exports = () => {
//   // creating our event listeners for IPC events
//   ipcMain.on('testing-SSE', (event, url, reqResObj) => {
//     console.log('received!!!')
//     // we pass the event object into these controller functions so that we can invoke event.sender.send when we need to make response to renderer process
//     SSEController.testing(url, reqResObj, event);
//   })
// }; 

module.exports = SSEController; 