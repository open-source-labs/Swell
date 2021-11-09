import React, { useState , useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

const WebhookContainer = (props) => {
  // socket.onmessage = (message) => console.log(message); 
  socket.on('connect', () => {
    console.log('open sesame');
    socket.send('omg');
  })

  useEffect(() => {
    console.log('useeffect');
    console.log(socket);
    socket.on('url', (event) => updateURL(event))
  }, [])

  const testing = () => {
    //console.log(io.engine);
    console.log('testtingggg');
    socket.emit('message', { 'hi': 'help'})
  };

  let serverOn = false;
  const startServerButton = () => {
    console.log(props);
    console.log('WE GOT HEREE!!!');
    if (!serverOn) {
      // turn on ngrok connection/URL
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
      <button className="button is-wh" onClick={() => testing()}>
        TESTING
      </button>
      {/* <div> { bob } </div> */}
      {/* <button className="button is-wh" onClick={() => stopServerButton()}>
        STOP SERVER
      </button> */}
    </div>
  );
}

export default WebhookContainer;

  