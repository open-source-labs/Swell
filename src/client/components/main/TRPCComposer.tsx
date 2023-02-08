import React from 'react';
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

// Import MUI components
import { Box } from '@mui/material';
import { $TSFixMe } from '../../../types';
import { RootState } from '../../toolkit-refactor/store';

// import tRPC client Module
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";

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



  const sendRequest = () => {
    // Import trpc/client import { createTRPCProxyClient, httpBatchLink } from "@trpc/client"
    // Import safe eval

    // url - useSelector(state.newRequestFields.url)
    // hardcode the url
    const clientURL = 'http://localhost:3001/trpc';

    const client = createTRPCProxyClient({
      links: [
        httpBatchLink({
          url: clientURL, // this would be the url from user eg: http://localhost:3000/trpc  (assuming it is listening)
        }),
      ],
    })
    // actual query - useSelector(state.newRequest.newRequestBody)
    console.log("logging req body pre request", requestBody);
    const request = requestBody.bodyContent
    // console.log(JSON.stringify(eval(request)));
    // safeEval(request).then((res: object) => console.log(JSON.stringify(res)));
    console.log(request);
    eval(request).then((res: object) => console.log(JSON.stringify(res)));
    // eval(request);
    // send request
    // worry about connecting to store and sending both the request and response to the store
    // client.users.byId.query('1')
  };


  return (
    <Box
      className="is-flex-grow-3 add-vertical-scroll"
      sx={{
        height: '40%',
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
        {/* <TRPCMethodAndEndpointEntryForm
          requestFields={requestFields}
          requestHeaders={requestHeaders}
          newRequestHeadersSet={newRequestHeadersSet}
          newRequestCookiesSet={newRequestCookiesSet}
          newRequestBodySet={newRequestBodySet}
          warningMessage={warningMessage}
          setWarningMessage={setWarningMessage}
        /> */}
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
