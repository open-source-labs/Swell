import React, { useState , useEffect } from 'react';
import { useSelector } from 'react-redux';
import uuid from 'uuid/v4';
import { io } from 'socket.io-client';


const socket = io('http://localhost:3000');

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
  
  const [whUrl, updateURL] = useState('');
  const [serverStatus, updateServerStatus] = useState(false);
  const isDark = useSelector(state => state.ui.isDark);

  const copyClick = () => {
    console.log('copying');
    navigator.clipboard.writeText(whUrl);
  };
  
  useEffect(() => {
    socket.on('response', (event) => {
      console.log("this is the event in webho", event.headers);
      const protocol = 'I do not know what this is for?';
      console.log('this is event.headers', event.headers["user-agent"]);
      // url = event.headers;
      url = event.headers['user-agent'];
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
        connection: 'farts',
        connectionType: null,
        checkSelected: false,
        request: {
          method,
          url,
          event,
          // messages: [],
          // body: bodyContent || '',
          // bodyType,
          // bodyVariables: bodyVariables || '',
          // rawType,
          network
          // restUrl,
          // webrtcUrl,
        },
        response: {
          events: [event.body],
          headers: event.headers,
        },
        checked: false,
        minimized: false,
        tab: currentTab,
      };
            console.log('line 125 in webho', reqRes);
      reqResAdd(reqRes);
    });
  }, []);

  const startServerButton = () => {
    if (!serverStatus) {
      updateServerStatus(true);
      
      // turn on ngrok connection/URL
      // request server.js to generate and return a webhook URL
      fetch('http://localhost:3000/webhookServer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((data) => data.json())
        .then((data) => {
          // set boolean value server status to true
          updateServerStatus(true);
          console.log(`${data}/webhook`);
          // set
          updateURL(`${data}/webhook`);
          console.log('updatedURL', data);
        })
        .catch((err) => console.error(err));
    } else if (serverStatus) {
      // request server to kill webhook url instance
      updateServerStatus(false);
      fetch('http://localhost:3000/webhookServer', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((data) => data.json())
        .then((url) => {
          // set boolean value server status to false
          console.log(url)
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <div className='mr-2 is-flex is-justify-content-center'
    style={{padding: '10px'}}>
    <button
           className={`button ${
             serverStatus ? 'is-wh' : 'is-wh-on'
           }  add-request-button is-vertical-align-center no-border-please`}
           onClick={() => startServerButton()}
         >
           <span>{serverStatus ? 'Stop Server' : 'Start Server'}</span>
         </button>
         <input
           className={`${isDark ? 'dark-address-input' : ''} ml-1 input input-is-medium is-info`}
           type="text"
           value={whUrl}
         />
      <div className="is-3rem-footer is-clickable is-margin-top-auto">
         <button
           className="button is-primary-100 is-3rem-footer is-clickable no-border-please is-fullwidth ml-1 is-margin-top-auto"
           onClick={() => copyClick()}
         >
           Copy URL
         </button>
       </div>
   </div>
  );
};

export default WebhookContainer;

  

//   whUrl and serverStatus should eventually go into the redux store???
