import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
// Import controllers
import SendRequestButton from './new-request/SendRequestButton';
// Import local components
import TRPCMethodAndEndpointEntryForm from './tRPC/TRPCMethodAndEndpointEntryForm';
import TRPCBodyEntryForm from './tRPC/TRPCBodyEntryForm';
// Import Redux hooks
import { useSelector, useDispatch } from 'react-redux';
// Import Actions from RTK slice
import {
  newRequestHeadersSet,
  newRequestBodySet,
  newRequestCookiesSet,
} from '../../toolkit-refactor/newRequest/newRequestSlice';
import { responseDataSaved } from '../../toolkit-refactor/reqRes/reqResSlice'

// Import MUI components
import { Box } from '@mui/material';
import { $TSFixMe } from '../../../types';
import { RootState } from '../../toolkit-refactor/store';

// import tRPC client Module
import { createTRPCProxyClient, httpBatchLink, createWSClient, wsLink, splitLink } from "@trpc/client";
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';

/**
 * 
 */
export default function TRPCComposer() {
  const dispatch = useDispatch();
  /** newRequestBody slice from redux store, contains specific request info */
  const requestBody = useSelector((state: RootState) => state.newRequest.newRequestBody)

  /** newRequestFields slice from redux store, contains general request info*/
  const requestFields = useSelector((state: RootState) => state.newRequestFields)

  /** reqRes slice from redux store, contains request and response data */
  const requestStuff = useSelector((state: RootState) => state.newRequest)

  let subscription: any;

  const sendRequest = () => {

    let isWebsocket = false;
    const links = [];
    const clientURL: string = requestFields.url; //grabbing url 
    const request = requestBody.bodyContent;
    const httpRegex = /^http:\/\/([a-zA-Z0-9-]+\.[a-zA-Z]{2,}|localhost)(:[0-9]+)?(\/.*)?$/ // trpc doesn't accept https requests to my knowledge otherwise https?
    const wsRegex = /^(ws|wss):\/\/(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}|localhost)(:[0-9]+)?(\/.*)?$/;
    
    //checks if URL is to WebSocket or standard HTTP
    if (wsRegex.test(clientURL)) {
      
      // setup links array with ws
      isWebsocket = true;

      //instantiates a WebSocket
      const wsClient = createWSClient({ url: clientURL })
      links.push(wsLink({ client: wsClient }))

      //grabs the WebSocket from tRPC's wsClient
      const ws = wsClient.getConnection();
      const persistentData: Array<any> = [];

      //current WebSocket is listening for anytime an event is sent back to client
      ws.onmessage = ((event) => {  
        console.log(ws.readyState); 
        persistentData.push(JSON.parse(event.data));
          const newCurrentResponse: any = {
            checkSelected: false,
            checked: false,
            connection: "closed",
            connectionType: "plain",
            createdAt: new Date(),
            gRPC: false,
            graphQL: false,
            host: clientURL,
            id: uuid(),
            minimized: false,
            path: "/",
            protoPath: undefined,
            protocol: "ws://",
            request: {...requestStuff},
            tab: undefined,
            timeReceived: 1676146914257,
            timeSent: 1676146914244,
            url: clientURL,
            webrtc: false,
            response: {
              events: [],
            }
          };
        newCurrentResponse.response.events.push(([...persistentData]));
        dispatch(responseDataSaved(newCurrentResponse));
      });

    } else if (httpRegex.test(clientURL)) {

      // setup links array with http
      links.push(httpBatchLink({ url: clientURL }));
      
    } else {
      console.log('error in url');
    }

    const client = createTRPCProxyClient({ links: links });
    
    //if the request is to a WebSocket server + is a subscription, execute request
    if (isWebsocket) {
      
      //replacing user's client name to what app is expecting
      const editedRequest = request.replace(/^[^.]*./, "client.")
      subscription = eval(editedRequest);
      console.log(subscription);
    
    } else {
      
      //if request is not from Websocket server + is query/mutation, execute request
        //this handles batch queries + mutations
      const reqArray = request.split("\n").map(el => {
        el = el.replace(/^[^.]*./, "client.")
        return el;
      });
      
      Promise.all(reqArray.map(el => eval(el))).then((res: any) => {
        const newCurrentResponse: any = {
          checkSelected: false,
          checked: false,
          connection: "closed",
          connectionType: "plain",
          createdAt: new Date(),
          gRPC: false,
          graphQL: false,
          host: clientURL,
          id: uuid(),
          minimized: false,
          path: "/",
          protoPath: undefined,
          protocol: "http://",
          request: {...requestStuff},
          tab: undefined,
          timeReceived: null,
          timeSent: null,
          url: clientURL,
          webrtc: false,
          response: {
            events: [res],
          }
        };
        
        //dispatch response to it's slice, to update the state
        dispatch(responseDataSaved(newCurrentResponse));
      });
    }  
  };

  return (
    <Box
      className="is-flex-grow-3 add-vertical-scroll"
      sx={{
        height: '100%',
        px: 1,
        overflowX: 'scroll',
        overflowY: 'scroll',
      }}
      id="composer-graphql"
    >
      <div
        className="is-flex-grow-3 add-vertical-scroll"
        style={{ overflowX: 'hidden' }}
      >
        <TRPCMethodAndEndpointEntryForm/>
        <TRPCBodyEntryForm newRequestBodySet={newRequestBodySet}/>
      </div>
      <div className="is-3rem-footer is-clickable is-margin-top-auto" style={{display: 'flex', justifyContent: 'space-around'}}>
        <SendRequestButton onClick={sendRequest} />
        {requestFields.method === 'SUBSCRIPTION' && <SendRequestButton onClick={() => subscription.unsubscribe()} buttonText = 'Close Subscription'></SendRequestButton>}
      </div>
    </Box>
  );
}
