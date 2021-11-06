// import { coerceInputValue } from 'graphql';
import React from 'react';
import uuid from 'uuid/v4';

// import io from 'socket.io-client';
// let socket = io(`http://localhost:3000`);
// import { Socket } from 'net';
// import historyController from '../../controllers/historyController';


const WebhookContainer = (props) => {
  // const socketProtocol = (window.location.protocol === 'https:' ? 'wss:' : 'ws:');
  // const echoSocketUrl = socketProtocol + '//' + window.location.hostname + '/echo/';
  // const socket = new WebSocket(echoSocketUrl);
  // const socket = new WebSocket('ws//localhost:3000');
  const testing = () => {
    console.log("testing");
    return "blah";
    // console.log("testing socket", socket);
  }
  
  // socket.addEventListener('open', function (event) {
  //   console.log('THE CLIENT IS CONNETED TO THE SERVER???');
  // });

  // socket.onmessage = ( data ) => {
  //   console.log('Message from server', data);
  // };

      let serverOn = false;
  const startServerButton = () => {
    console.log(props);
    console.log('WE GOT HEREE!!!');
    if (!serverOn) {
      serverOn = true;
      fetch('/webhookServer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((data) => data.json())
        .then((url) => console.log(url))
        .catch((err) => console.error(err));
  }
    else if (serverOn){
    serverOn = false;
    fetch('/webhookServer', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((data) => data.json())
      .then((url) => console.log(url))
      .catch((err) => console.error(err));
    }
    
}
  return (
    <div>
      <button className="button is-wh" onClick={() => startServerButton()}>
        Start/Close Server
      </button>
      <button className="button is-wh" onClick={() => console.log('lol')}>
        TESTING
      </button>
      <div> </div>
      {/* <script>
          {const socket = WebSocket('ws://localhost:3000');
          socket.addEventListener('open', function(event){
            console.log('Connected to WS Server')
          });
          
          socket.addEventListener('message', function(event){
            console.log('Message from server ', event.data);
          });
          }
      </script> */}
      {/* <button className="button is-wh" onClick={() => stopServerButton()}>
        STOP SERVER
      </button> */}
    </div>
  );
}

export default WebhookContainer;

  //button to generate URL
  //button to start/stop sever
  //figure out how to listen to the webhook
  //save serverOn variable in the store 
  //dispatch that serverOn prop 
  //create component for url field?
  //add request to history
  //reset fields after request is sent
  