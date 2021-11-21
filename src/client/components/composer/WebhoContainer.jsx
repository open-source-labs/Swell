import React, { useState , useEffect } from 'react';
import { useSelector } from 'react-redux';
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
  //   // socket.send('omg');
  // })

  const [whUrl, updateURL] = useState('');
  const [serverStatus, updateServerStatus] = useState(false);

  const copyClick = () => {
    console.log('copying');
    navigator.clipboard.writeText(whUrl);
    // alert('Copied the text: ' + whUrl);
  };
  // document.getElementById(id);


  
  useEffect(() => {
    socket.on('response', (event) => {
      console.log("this is the event in webho", event);
      // console.log(newRequestFields, "line 74 in webho container");
      const protocol = 'blargh';
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
          event
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
          events: [event],
          headers: {
            status: 200,
"accept-ranges": "bytes",
"access-control-allow-origin": "*",
"age": "0",
"alt-svc": "h3=\":443\"; ma=86400, h3-29=\":443\"; ma=86400, h3-28=\":443\"; ma=86400, h3-27=\":443\"; ma=86400",
"cache-control": "no-cache, private",
"cf-cache-status": "DYNAMIC",
"cf-ray": "6ac55515dce6360a-LAX",
"content-length": "98",
"content-type": "application/json",
date: "Thu, 11 Nov 2021 06:06:03 GMT",
"expect-ct": "max-age=604800, report-uri=\"https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct\"",
nel: "{\"success_fraction\":0,\"report_to\":\"cf-nel\",\"max_age\":604800}",
"report-to": "{\"endpoints\":[{\"url\":\"https:\\/\\/a.nel.cloudflare.com\\/report\\/v3?s=oMIGdwzcB2tmKYbzD21nGNwCUZpPDBhcYbDeq8UVAhRyid%2F4nllC6Et9TM0hBq6AsErp%2B8%2F6k7WqvhRPgEpdPw9biihWynK5rqLwpedI%2FVjUJHr9w85WNfnqoKFV1w%3D%3D\"}],\"group\":\"cf-nel\",\"max_age\":604800}",
server: "cloudflare",
vary: "",
via: "1.1 varnish (Varnish/6.3), 1.1 varnish (Varnish/6.3)",
"x-cache": "MISS",
"x-cache-hits": "0",
"x - powered - by": "PHP/7.3.17"}
        },
        checked: false,
        minimized: false,
        tab: currentTab,
      };

      reqResAdd(reqRes);

      // VVVVV don't know why we need these but this was in the other containters VVVVVV
      // setNewRequestBody({
      //   ...newRequestBody,
      //   bodyType: 'webhook',
      //   rawType: '',
      // });
      // setNewRequestFields({
      //   ...newRequestFields,
      //   url: webhook,
      //   webhook
      // });
      // setWorkspaceActiveTab('workspace');

      console.log(event, "line 125 in webho");
    });
  }, []);

  const startServerButton = () => {
    if (!serverStatus) {
      updateServerStatus(true);
      // turn on ngrok connection/URL
      // request server.js to generate and return a webhook URL
      fetch('/webhookServer', {
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
      fetch('/webhookServer', {
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

  const isDark = useSelector(state => state.ui.isDark);

  // when redux happens
  // <div className={`banner ${active ? "active" : ""}`}>{children}</div>
  return (
    <div className="is-flex is-flex-direction-column is-justify-content-space-between is-tall">
    {/* <div className="is-3rem-footer is-fullwidth is-primary-100 add-request-button is-vertical-align-center"> */}
      
      <button
        className={`button ${serverStatus ? 'is-wh' : 'is-wh-on'}  add-request-button is-vertical-align-center`}
        onClick={() => startServerButton()}>
        {serverStatus ? 'Stop Server' : 'Start Server'}
      </button>

      <div className='is-flex is-flex-direction-column justify-content-center'>
        <input
          className={`${isDark ? 'is-dark-300' : ''} ml-1 input input-is-medium is-info`}
          type="text"
          value={whUrl}
        /> 
      
        <div className="is-3rem-footer is-clickable is-margin-top-auto">
          <button
          className= "button is-primary-100 is-3rem-footer is-clickable is-fullwidth is-margin-top-auto"
          onClick={() => copyClick()}
          >Copy URL</button>
        </div>
      </div>
    </div>
  );
};

export default WebhookContainer;

  

//   whUrl and serverStatus should eventually go into the redux store???
