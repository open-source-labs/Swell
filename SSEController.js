
const { ipcMain }  = require('electron');
const EventSource = require('eventsource');
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
    console.log('received message')
    message.timeReceived = Date.now(); 
    // FIX THIS LATER!!!
    if (!reqResObj.response.events) reqResObj.response.events = []; 
    reqResObj.response.events.push(message);
    reqResObj.response.headers = {};
    reqResObj.response.headers['content-type'] = 'text/event-stream'
    console.log('created this : ', reqResObj.response)
    event.sender.send('reqResUpdate', JSON.parse(reqResObj));
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

module.exports = () => {
  // creating our event listeners for IPC events
  ipcMain.on('testing-SSE', (event, url, reqResObj) => {
    console.log('received!!!')
    // we pass the event object into these controller functions so that we can invoke event.sender.send when we need to make response to renderer process
    SSEController.testing(url, reqResObj, event);
  })
}; 