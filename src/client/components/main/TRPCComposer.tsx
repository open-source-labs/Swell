import React, { useState } from 'react';
import gql from 'graphql-tag';
import { v4 as uuid } from 'uuid';
// Import controllers
import historyController from '../../controllers/historyController';
import SendRequestButton from './new-request/SendRequestButton';
// Import local components

/**
 * @todo CHANGE CODE TO REFELCT TRPC
 */
import HeaderEntryForm from './new-request/HeaderEntryForm.jsx';
import TRPCMethodAndEndpointEntryForm from './tRPC/TRPCMethodAndEndpointEntryForm';
import CookieEntryForm from './new-request/CookieEntryForm';
import TRPCBodyEntryForm from './tRPC/TRPCBodyEntryForm';
import NewRequestButton from './new-request/NewRequestButton.jsx';
import TestEntryForm from './new-request/TestEntryForm.jsx';

// Import Redux
import { useSelector, useDispatch } from 'react-redux';

import {
  newRequestHeadersSet,
  newRequestBodySet,
  newRequestCookiesSet,
  composerFieldsReset,
} from '../../toolkit-refactor/newRequest/newRequestSlice';


import {
  reqResReplaced,
  reqResCleared,
  reqResItemAdded,
  reqResItemDeleted,
  reqResUpdated,
  responseDataSaved,
} from '../../toolkit-refactor/reqRes/reqResSlice'

// Import MUI components
import { Box } from '@mui/material';
import { $TSFixMe } from '../../../types';
import { RootState } from '../../toolkit-refactor/store';

// import tRPC client Module
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { AnyAction } from 'redux';
import { bool } from 'prop-types';

/**@todo remov */
//import safeEval from 'safe-eval';

// Translated from GraphQLContainer.jsx
export default function TRPCComposer(props: $TSFixMe) {
  const {
    setWarningMessage,
    warningMessage,
    setWorkspaceActiveTab,
  } = props;
  const dispatch = useDispatch();
  const requestBody = useSelector((state: RootState) => state.newRequest.newRequestBody)
  const requestHeaders = useSelector((state: RootState) => state.newRequest.newRequestHeaders)
  const requestFields = useSelector((state: RootState) => state.newRequestFields)


  // REMOVE
  const requestStuff = useSelector((state: RootState) => state.newRequest)

  const sendRequest = () => {

    const clientURL: string = requestFields.url; //grabbing url from
    console.log(clientURL)
    const client = createTRPCProxyClient({
      links: [
        httpBatchLink({
          url: clientURL, // this would be the url from user eg: http://localhost:3000/trpc  (assuming it is listening)
        }),
      ],
    })
    // actual query - useSelector(state.newRequest.newRequestBody)
    const request = requestBody.bodyContent
    // console.log(JSON.stringify(eval(request)));
    // safeEval(request).then((res: object) => console.log(JSON.stringify(res)));

    // function parseStringToJSON(str) {
    //   try {
    //     // Add quotes around the property names
    //     str = str.replace(/([a-zA-Z0-9]+):/g, '"$1":');
    //     const obj = JSON.parse(str);
    //     return JSON.stringify(obj, null, 2);
    //   } catch (error) {
    //     return "Invalid JSON string";
    //   }
    // }

    // STEP 2: send request
    console.log(request);
    // const displayRes = eval(request).then((res: object) => JSON.stringify(res))
    //   .then((res:any) => setDisplay(res));
    const reqArray = request.split("\n");

    Promise.all(reqArray.map(el => eval(el))).then((res: any) => {
        const newCurrentResponse: any = {
          checkSelected: false,
          checked: false,
          connection: "closed",
          connectionType: "plain",
          createdAt: new Date(),
          gRPC: false,
          graphQL: false,
          host: "http://localhost:3000",
          id: "2702218b-854d-4530-a480-9efa5af2c821",
          minimized: false,
          path: "/",
          protoPath: undefined,
          protocol: "http://",
          request: {...requestStuff},
          tab: undefined,
          timeReceived: 1676146914257,
          timeSent: 1676146914244,
          url: clientURL,
          webrtc: false,
          response: {
            events: [res],
          }
        };
        dispatch(responseDataSaved(newCurrentResponse));
      });


    // Promise.all(reqArray.map(el => eval(el))).then((res: any)=> setDisplay(res));

    //STEP 3: Update info in req res and dispatch new req, res to store
    // dispatch(reqResUpdated); // how long did it take?

    //STEP 4: figure out how to get response to display if it isnt

    // eval(request);
    // send request
    // worry about connecting to store and sending both the request and response to the store
    // client.users.byId.query('1')

    // In the SingleReqResContainer
    // responseSent() => {
    //   // check the request type
    //   // if it's http, dispatch set active tab to "event" for reqResResponse
    //   // otherwise do nothing
    //   if (connectionType !== 'WebSocket') {
    //     dispatch(setResponsePaneActiveTab('events'));
    //   }
    //   // console.log(content)
    //   connectionController.openReqRes(content.id);
    //   dispatch(
    //     responseDataSaved(
    //       content,
    //       'singleReqResContainercomponentSendHandler'
    //     )
    //   // ); //dispatch will fire first before the callback of [ipcMain.on('open-ws'] is fired. check async and callback queue concepts
    // }}
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
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        // tabIndex={0}
      >
        <TRPCMethodAndEndpointEntryForm
          requestFields={requestFields}
          requestHeaders={requestHeaders}
          newRequestHeadersSet={newRequestHeadersSet}
          newRequestCookiesSet={newRequestCookiesSet}
          newRequestBodySet={newRequestBodySet}
          warningMessage={warningMessage}
          setWarningMessage={setWarningMessage}
        />
        {/* <HeaderEntryForm
          RequestFields={requestFields}
          newRequestHeadersSet={newRequestHeadersSet}
          newRequestStreamsSet={newRequestStreamsSet}
        />
        <CookieEntryForm
          newRequestCookies={newRequestCookies}
          newRequestBody={newRequestBody}
          newRequestCookiesSet={newRequestCookiesSet}
        /> */}
        <TRPCBodyEntryForm newRequestBodySet={newRequestBodySet}/>
        {/* <TRPCVariableEntryForm
          newRequestBody={newRequestBody}
          newRequestBodySet={newRequestBodySet}
        /> */}
      </div>
      <div className="is-3rem-footer is-clickable is-margin-top-auto">
        <SendRequestButton onClick={sendRequest} />
      </div>
    </Box>
  );
}
