import React, { useState , useEffect } from 'react';
import { io } from 'socket.io-client';
import uuid from 'uuid/v4';
const socket = io('http://localhost:3000');

// socket.on('response', (event) => console.log(event))

const WebhookContainer = ({
  resetComposerFields,
  setNewRequestFields,
  newRequestFields,
  newRequestFields: {
    gRPC,
    webrtc,
    url,
    method,
    graphQL,
    restUrl,
    wsUrl,
    gqlUrl,
    grpcUrl,
    webhook,
    network,
    testContent,
  },
  setNewTestContent,
  setNewRequestBody,
  newRequestBody,
  newRequestBody: {
    JSONFormatted,
    rawType,
    bodyContent,
    bodyVariables,
    bodyType,
  },
  setNewRequestHeaders,
  newRequestHeaders,
  newRequestHeaders: { headersArr },
  setNewRequestCookies,
  newRequestCookies,
  newRequestCookies: { cookiesArr },
  setNewRequestStreams,
  newRequestStreams,
  newRequestStreams: { protoPath },
  newRequestSSE: { isSSE },
  currentTab,
  introspectionData,
  setComposerWarningMessage,
  warningMessage,
  reqResAdd,
  setWorkspaceActiveTab,
}) => {
  // socket.onmessage = (message) => console.log(message);
  // socket.on('connect', () => {
  //   console.log('open sesame');
  //   socket.send('omg');
  // })
  const [whUrl, updateURL] = useState('');

  const copyClick = () => {
    console.log('copying');
    navigator.clipboard.writeText(whUrl);
    // alert('Copied the text: ' + whUrl);
  };
  // document.getElementById(id);

  socket.on('response', (event) => {
        const protocol = 'url.match(/(https?:\/\/)|(wss?:\/\/)/)[0]';
    const reqRes = {
      id: uuid(),
      created_at: new Date(),
      protocol,
      host: '',
      path: '',
      graphQL,
      gRPC,
      webrtc,
      webhook,
      url,
      timeSent: null,
      timeReceived: null,
      connection: 'uninitialized',
      connectionType: null,
      checkSelected: false,
      request: {
        method,
        url,
        // messages: [],
        // body: bodyContent || '',
        // bodyType,
        // bodyVariables: bodyVariables || '',
        // rawType,
        // network,
        // restUrl,
        // webrtcUrl,
      },
      response: {

      },
      checked: false,
      minimized: false,
      tab: currentTab,
    };
    // const eventstuff = "I am breaking this";
    console.log(event);
    console.log('WE DID')
    reqResAdd(reqRes);
  });

  useEffect(() => {
    console.log('useeffect');
    // socket.on('response', (event) => console.log(event))
  }, []);

  const testing = () => {
    console.log('testing button');
    socket.emit('message', { hi: 'help' });
  };

  let serverOn = false;
  const startServerButton = () => {
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
        .then((whUrl) => {
          console.log(`${whUrl}/webhook`);
          updateURL(`${whUrl}/webhook`);
          console.log('updatedURL', whUrl);
        })
        .catch((err) => console.error(err));
    } else if (serverOn) {
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
  };
  return (
    <div className="is-flex is-flex-direction-column is-tall">
      <button
        className="button is-3rem-footer is-wh is-fullwidth is-primary-100 add-request-button is-vertical-align-center"
        onClick={() => startServerButton()}
      >
        Start/Close Server
      </button>
      <br />
      <div id="">
        <div
          className="ml-1 input input-is-medium is-info"
          type="text"
          placeholder="Generate your webhook"
        > {whUrl} </div>
      </div>
      <div className="is-3rem-footer is-clickable is-margin-top-auto">
        <button
        className= "button is-normal is-fullwidth is-primary-100 is-button-footer add-request-button is-vertical-align-center"
        onClick={() => copyClick()}
       >Copy URL</button>
      </div>
      

      {/* <button className="button is-wh" onClick={() => stopServerButton()}>
        STOP SERVER
      </button> */}
    </div>
  );
};

export default WebhookContainer;

  