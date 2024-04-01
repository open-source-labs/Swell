import React, { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { io } from 'socket.io-client';

// Import MUI components
import { Box } from '@mui/material';
import { $TSFixMe } from '../../../../types';


export default function WebhookComposer(props: $TSFixMe) {
  /**
   * @todo There was a previous todo with the text "A relic of the past... it
   * must be purged." We're 99% sure this refers to the isDark variable, rather
   * than anything else in the component.
   *
   * This seems to have been put in place before the dedicated UI slice had a
   * chance to be created.
   */
  const isDark = false;

  const {
    // composerFieldsReset,
    // newRequestFields,
    newRequestFields: {
      gRPC,
      webrtc,
      url,
      method,
      graphQL,
      // restUrl,
      // wsUrl,
      // gqlUrl,
      // grpcUrl,
      webhook,
      network,
      // testContent,
    },
    // newTestContentSet,
    // newRequestBodySet,
    // newRequestBody,
    newRequestBody: {
      // JSONFormatted,
      // rawType,
      // bodyContent,
      // bodyVariables,
      // bodyType,
    },
    // newRequestHeadersSet,
    // newRequestHeaders,
    newRequestHeaders: { headersArr },
    // newRequestCookiesSet,
    // newRequestCookies,
    newRequestCookies: { cookiesArr },
    // newRequestStreamsSet,
    // newRequestStreams,
    newRequestStreams: { protoPath },
    newRequestSSE: { isSSE },
    currentTab,
    //introspectionData,
    //setWarningMessage,
    //warningMessage,
    reqResItemAdded,
    //setWorkspaceActiveTab,
  } = props;

  const [whUrl, updateURL] = useState('');
  const [serverStatus, updateServerStatus] = useState(false);

  // This stops the polling of the server.
  // You get tons of errors in the browser console
  // without this code block
  let socket: $TSFixMe
  if (serverStatus) {
    socket = io('http://localhost:3000');
  } 

  const copyClick = () => {
    console.log('copying');
    navigator.clipboard.writeText(whUrl);
  };

  useEffect(() => {
    if (socket !== undefined) {
      socket.on('response', (event) => {
        console.log('this is the event in webhook', event.headers);
        const protocol = 'I do not know what this is for?';
        console.log('this is event.headers', event.headers['user-agent']);
        // url = event.headers;
        const url = event.headers['user-agent'];
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
          // connection: 'farts',
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
            network,
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
        reqResItemAdded(reqRes);
      });
    }
  }, []);

  const startServerButton = () => {
    
    if (!serverStatus) {
      updateServerStatus(true);

      // turn on ngrok connection/URL
      // request server.js to generate and return a webhook URL
      fetch('/webhookServer', {
        method: 'POST',
        mode: 'no-cors',
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
          console.log(url);
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <Box
      className="mr-2 is-flex is-justify-content-center container-margin"
      sx={{ padding: '10px', height: '100%', width: '100%' }}
      id="composer-webhook"
    >
      <button
        className={`button ${
          serverStatus ? 'is-wh' : 'is-wh-on'
        }  add-request-button is-vertical-align-center no-border-please`}
        onClick={() => startServerButton()}
      >
        <span>{serverStatus ? 'Stop Server' : 'Start Server'}</span>
      </button>
      <input
        className={`${
          isDark ? 'dark-address-input' : ''
        } ml-2 input input-is-medium is-info`}
        type="text"
        value={whUrl}
        readOnly //solved react error dev console
      />
      <div className="is-no-top-margin-footer is-clickable is-margin-top-auto">
        <button
          className="button is-primary-100 is-no-top-margin-footer is-clickable no-border-please ml-2 is-margin-top-auto"
          onClick={() => copyClick()}
        >
          Copy URL
        </button>
      </div>
    </Box>
  );
}
