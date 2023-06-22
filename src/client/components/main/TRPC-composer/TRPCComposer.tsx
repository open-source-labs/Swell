import React from 'react';
import { v4 as uuid } from 'uuid';
// Import local components
import TRPCMethodAndEndpointEntryForm from './TRPCMethodAndEndpointEntryForm';
// Import Redux hooks
import { useSelector, useDispatch } from 'react-redux';
// Import Actions from RTK slice
import { responseDataSaved } from '../../../toolkit-refactor/slices/reqResSlice';
import { useState } from 'react';

// Import MUI components
import { Box } from '@mui/material';
import { RootState } from '../../../toolkit-refactor/store';
import HeaderEntryForm from '../sharedComponents/requestForms/HeaderEntryForm';
import TRPCProceduresContainer from './TRPCProceduresContainer';

// import tRPC client Module
import {
  createTRPCProxyClient,
  httpBatchLink,
  createWSClient,
  wsLink,
} from '@trpc/client';

import Store from '../../../toolkit-refactor/store';

/**
 *
 */

const PROCEDURE_DEFAULT = {
  procedureMethod: 'QUERRY',
  endpoint: '',
  variable: '',
};
export default function TRPCComposer(props) {
  const dispatch = useDispatch();
  /** newRequestBody slice from redux store, contains specific request info */
  const requestBody = useSelector(
    (state: RootState) => state.newRequest.newRequestBody
  );

  const [procedures, setProcedures] = useState([
    { method: 'QUERRY', endpoint: '.user', variable: '{hello:World}' },
  ]);

  const {
    newRequestHeadersSet,
    newRequestStreamsSet,
    newRequestFields,
    newRequestHeaders,
    newRequestBody,
    newRequestStreams,
  } = props;

  /** newRequestFields slice from redux store, contains general request info*/
  const requestFields = useSelector(
    (state: RootState) => state.newRequestFields
  );

  /** reqRes slice from redux store, contains request and response data */
  const newRequest = useSelector((state: RootState) => state.newRequest);
  // const headers = requestStuff.newRequestHeaders.headersArr.filter(
  //   (x) => x.active
  // );

  let subscription: any;

  // const sendRequest = () => {
  //   let isWebsocket = false;
  //   const links = [];
  //   const clientURL: string = requestFields.url; //grabbing url
  //   const request = requestBody.bodyContent;
  //   const httpRegex =
  //     /^http:\/\/([a-zA-Z0-9-]+\.[a-zA-Z]{2,}|localhost)(:[0-9]+)?(\/.*)?$/; // trpc doesn't accept https requests to my knowledge otherwise https?
  //   const wsRegex =
  //     /^(ws|wss):\/\/(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}|localhost)(:[0-9]+)?(\/.*)?$/;

  //   //checks if URL is to WebSocket or standard HTTP
  //   if (wsRegex.test(clientURL)) {
  //     // setup links array with ws
  //     isWebsocket = true;

  //     //instantiates a WebSocket
  //     const wsClient = createWSClient({ url: clientURL });
  //     links.push(wsLink({ client: wsClient }));

  //     //grabs the WebSocket from tRPC's wsClient
  //     const ws = wsClient.getConnection();
  //     const persistentData: Array<any> = [];

  //     //current WebSocket is listening for anytime an event is sent back to client
  //     ws.onmessage = (event) => {
  //       persistentData.push(JSON.parse(event.data));
  //       const newCurrentResponse: any = {
  //         checkSelected: false,
  //         checked: false,
  //         connection: 'closed',
  //         connectionType: 'plain',
  //         createdAt: new Date(),
  //         gRPC: false,
  //         graphQL: false,
  //         host: clientURL,
  //         id: uuid(),
  //         minimized: false,
  //         path: '/',
  //         protoPath: undefined,
  //         protocol: 'ws://',
  //         request: { ...requestStuff },
  //         tab: undefined,
  //         timeReceived: 1676146914257,
  //         timeSent: 1676146914244,
  //         url: clientURL,
  //         webrtc: false,
  //         response: {
  //           events: [],
  //         },
  //       };
  //       newCurrentResponse.response.events.push([...persistentData]);
  //       dispatch(responseDataSaved(newCurrentResponse));
  //     };
  //   } else if (httpRegex.test(clientURL)) {
  //     // setup links array with http
  //     links.push(httpBatchLink({ url: clientURL }));
  //   } else {
  //     console.log('error in url');
  //   }

  //   const client = createTRPCProxyClient({ links: links });

  //   //if the request is to a WebSocket server + is a subscription, execute request
  //   if (isWebsocket) {
  //     //replacing user's client name to what app is expecting
  //     const editedRequest = request.replace(/^[^.]*./, 'client.');
  //     subscription = eval(editedRequest);
  //   } else {
  //     //if request is not from Websocket server + is query/mutation, execute request
  //     //this handles batch queries + mutations
  //     const reqArray = request.split('\n').map((el) => {
  //       el = el.replace(/^[^.]*./, 'client.');
  //       return el;
  //     });

  //     Promise.all(reqArray.map((el) => eval(el))).then((res: any) => {
  //       const newCurrentResponse: any = {
  //         checkSelected: false,
  //         checked: false,
  //         connection: 'closed',
  //         connectionType: 'plain',
  //         createdAt: new Date(),
  //         gRPC: false,
  //         graphQL: false,
  //         host: clientURL,
  //         id: uuid(),
  //         minimized: false,
  //         path: '/',
  //         protoPath: undefined,
  //         protocol: 'http://',
  //         request: { ...requestStuff },
  //         tab: undefined,
  //         timeReceived: null,
  //         timeSent: null,
  //         url: clientURL,
  //         webrtc: false,
  //         response: {
  //           events: [res],
  //         },
  //       };

  //       //dispatch response to it's slice, to update the state
  //       dispatch(responseDataSaved(newCurrentResponse));
  //     });
  //   }
  // };

  const sendRequest = () => {};
  return (
    <Box
      className="is-flex is-flex-direction-column is-justify-content-space-between"
      sx={{ height: '100%', width: '100%' }}
      id="composer-trpc"
    >
      <div
        className="is-flex-grow-3 add-vertical-scroll container-margin"
        style={{ overflowX: 'hidden' }}
      >
        <TRPCMethodAndEndpointEntryForm />
        <HeaderEntryForm
          newRequestHeaders={newRequestHeaders}
          newRequestStreams={newRequestStreams}
          newRequestBody={newRequestBody}
          newRequestFields={newRequestFields}
          newRequestHeadersSet={newRequestHeadersSet}
          newRequestStreamsSet={newRequestStreamsSet}
        />

        <TRPCProceduresContainer
          procedures={procedures}
          sendRequest={sendRequest}
        />

        {/* {requestFields.method === 'SUBSCRIPTION' && ( ////for subscription
          <SendRequestButton
            onClick={() => subscription.unsubscribe()}
            buttonText="Close Subscription"
          ></SendRequestButton>
        )} */}
      </div>
    </Box>
  );
}

