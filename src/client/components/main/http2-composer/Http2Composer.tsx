import React from 'react';
import { v4 as uuid } from 'uuid';
import { useAppDispatch, useAppSelector } from '../../../toolkit-refactor/hooks';

import { responseDataSaved } from '../../../toolkit-refactor/slices/reqResSlice';
import {
  setResponsePaneActiveTab,
  setSidebarActiveTab,
} from '../../../toolkit-refactor/slices/uiSlice';

// Import controllers
import connectionController from '../../../controllers/reqResController';
import historyController from '../../../controllers/historyController';

import RestMethodAndEndpointEntryForm from './RestMethodAndEndpointEntryForm';
import HeaderEntryForm from '../sharedComponents/requestForms/HeaderEntryForm';
import CookieEntryForm from '../sharedComponents/requestForms/CookieEntryForm';
import SendRequestButton from '../sharedComponents/requestButtons/SendRequestButton';
import NewRequestButton from '../sharedComponents/requestButtons/NewRequestButton';
import BodyEntryForm from '../sharedComponents/requestForms/BodyEntryForm';
import TestEntryForm from '../sharedComponents/requestForms/TestEntryForm';
// Import MUI components
import { Box, FormControlLabel, Switch } from '@mui/material';
import { CookieOrHeader, ReqRes, MainContainerProps, ValidationMessage } from '../../../../types';

import TestContainer from '../sharedComponents/stressTest/TestContainer';
import Store from '../../../toolkit-refactor/store';
import { type } from 'os';

// Translated from RestContainer.jsx
export default function Http2Composer(props: MainContainerProps) {
  const dispatch = useAppDispatch();
  // Destructuring store props.
  const {
    // currentTab,
    newRequestFields,
    newRequestHeaders,
    newRequestBody,
    newRequestCookies,
    newRequestStreams,
    newRequestSSE,
    warningMessage,
  } = props;

  const {
    gRPC,
    url,
    method,
    graphQL,
    restUrl,
    wsUrl,
    webrtc,
    gqlUrl,
    grpcUrl,
    network,
    testContent,
    tRPC,
  } = newRequestFields;

  const { JSONFormatted, rawType, bodyContent, bodyVariables, bodyType } =
    newRequestBody;

  // Destructuring dispatch props.
  const {
    fieldsReplaced,
    composerFieldsReset,
    newRequestBodySet,
    newTestContentSet,
    newRequestHeadersSet,
    newRequestCookiesSet,
    newRequestStreamsSet,
    newRequestSSESet,
    setWarningMessage,
    setWorkspaceActiveTab,
    reqResItemAdded,
  } = props;

  const { protoPath } = newRequestStreams;
  const { headersArr } = newRequestHeaders;
  const { cookiesArr } = newRequestCookies;
  const { isSSE } = newRequestSSE;

  /**
   * Validates the request before it is sent.
   * @returns ValidationMessage
   */
  const requestValidationCheck = (): ValidationMessage => {
    const validationMessage: ValidationMessage = {};
    // Error conditions...
    if (/https?:\/\/$|wss?:\/\/$/.test(url)) {
      //if url is only http/https/ws/wss://
      validationMessage.uri = 'Enter a valid URL';
    }
    if (!/(https?:\/\/)|(wss?:\/\/)/.test(url)) {
      //if url doesn't have http/https/ws/wss://
      validationMessage.uri = 'Enter a valid URL';
    }
    if (!JSONFormatted && rawType === 'application/json') {
      validationMessage.json = 'Please fix JSON body formatting errors';
    }
    return validationMessage;
  };

  // Returns a new ReqRes object based on user inputs
  const composeReqRes = (): ReqRes => {
    const protocol: ReqRes['protocol'] = url.match(
      /(https?:\/\/)/
    )![0] as ReqRes['protocol']; // used non-null assertion operator '!'
    const URIWithoutProtocol: string = `${url.split(protocol)[1]}/`;
    const host: string = protocol + URIWithoutProtocol.split('/')[0];
    let path: string = `/${URIWithoutProtocol.split('/')
      .splice(1)
      .join('/')
      .replace(/\/{2,}/g, '/')}`;
    if (path.charAt(path.length - 1) === '/' && path.length > 1) {
      path = path.substring(0, path.length - 1);
    }
    path = path.replace(/https?:\//g, 'http://');
    return {
      id: uuid(),
      createdAt: new Date(),
      protocol: protocol,
      host,
      path,
      url,
      webrtc,
      graphQL,
      gRPC,
      tRPC,
      timeSent: null,
      timeReceived: null,
      connection: 'uninitialized',
      connectionType: null,
      checkSelected: false,
      protoPath,
      request: {
        method,
        headers: headersArr.filter(
          (header: CookieOrHeader) => header.active && !!header.key
        ),
        cookies: cookiesArr.filter(
          (cookie: CookieOrHeader) => cookie.active && !!cookie.key
        ),
        body: bodyContent || '',
        bodyType,
        bodyVariables: bodyVariables || '',
        rawType,
        isSSE,
        network,
        restUrl,
        testContent: testContent || '',
        wsUrl,
        gqlUrl,
        grpcUrl,
      },
      response: {
        headers: {},
        events: [],
      },
      checked: false,
      minimized: false,
      // tab: currentTab,
    };
  };

  /*  
      This function is invoked when 'Send Request' is clicked. It validates input, 
      saves the reqRes information, clears current inputs, and finally dispatches
      the reqRes object.
  */
  const sendNewRequest = () : void => {
    // checks to see if input URL is empty or only contains http. If that is the case, return.
    const warnings = requestValidationCheck();
    if (Object.keys(warnings).length > 0) {
      setWarningMessage(warnings);
      return;
    }

    // creates a new reqRes object from user inputs and settings
    const reqRes: ReqRes = composeReqRes();

    // add request to history
    historyController.addHistoryToIndexedDb(reqRes);
    reqResItemAdded(reqRes);

    //reset for next request
    composerFieldsReset();
    dispatch(setResponsePaneActiveTab('events'));
    dispatch(setSidebarActiveTab('composer'));

    connectionController.openReqRes(reqRes.id);
    dispatch(responseDataSaved(reqRes));
  };

  /*  
      This function is invoked when 'Add to Workspace' is clicked. Similarly to 
      sendNewReqnest(), it validates input, 
      saves the reqRes information, clears current inputs, and finally dispatches
      the reqRes object.

      NOTE: we probably do not need both addNewRequest and sendNewRequest, because
      sendNewRequest will also add to workspace. 
  */
  const addNewRequest = (): void => {
    const warnings = requestValidationCheck();
    if (Object.keys(warnings).length > 0) {
      setWarningMessage(warnings);
      return;
    }
    const reqRes: ReqRes = composeReqRes();

    // add request to history
    historyController.addHistoryToIndexedDb(reqRes);
    
    // dispatches reqRes object
    reqResItemAdded(reqRes);

    //reset for next request
    composerFieldsReset();
    setWorkspaceActiveTab('workspace');
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
      id="composer-http2"
    >
      {/**
       * @todo The two commented-out components are our attempt to port the
       * entire app to use MaterialUI for consistency.
       *
       * The first one is an HTTP2Enpoint form with a (1) method select (2)
       * endpoint form (3) send button.
       *
       * The second one is all of the metadata you would need for an HTTP2
       * request (parameters, headers, body, cookies)
       *
       * These are not tied to the Redux store currently, and thus do not
       * interact with the app yet. They are just standalone components that
       * need to be integrated with the logic of the app.
       *
       * Import the following if you wish to uncomment the code below:
       *
       * import Http2EndpointForm from './Http2EndpointForm';
       * import Http2MetaData from './Http2MetaData'
       * import { BooleanValueNode } from 'graphql';
       * import { useState } from 'react';
       *
       * Also, setup the following interface and react hooks:
       *
       *  interface Parameter {
       *    id: string;
       *    key: string;
       *    value: string;
       *    toggle: boolean;
       *  }
       *   interface Header {
       *    id: string;
       *    key: string;
       *    value: string;
       *    toggle: boolean;
       *  }
       *   interface Cookie {
       *    id: string;
       *    key: string;
       *    value: string;
       *    toggle: BooleanValueNode;
       *  }
       *
       * const [parameters, setParameters] = useState<Parameter[]>([]);
       * const [headers, setHeaders] = useState<Header[]>([]);
       * const [cookies, setCookies] = useState<Cookie[]>([]);
       * const [http2Method, setHttp2Method] = useState('GET');
       * const [http2Uri, setHttp2Uri] = useState('');
       */}
      {/* <Http2EndpointForm
        http2Method={http2Method}
        setHttp2Method={setHttp2Method}
        http2Uri={http2Uri}
        setHttp2Uri={setHttp2Uri}
      />
      <Http2MetaData
        parameters={parameters}
        setParameters={setParameters}
        headers={headers}
        setHeaders={setHeaders}
        cookies={cookies}
        setCookies={setCookies}
        http2Method={http2Method}
      /> */}
      <div className="container-margin">
        <RestMethodAndEndpointEntryForm
          newRequestFields={newRequestFields}
          newRequestBody={newRequestBody}
          newTestContentSet={newTestContentSet}
          fieldsReplaced={fieldsReplaced}
          newRequestBodySet={newRequestBodySet}
          warningMessage={warningMessage}
          setWarningMessage={setWarningMessage}
          value={newRequestFields.restUrl}
        />
        <span>
          <div>
            <HeaderEntryForm
              newRequestHeaders={newRequestHeaders}
              newRequestStreams={newRequestStreams}
              newRequestBody={newRequestBody}
              newRequestFields={newRequestFields}
              newRequestHeadersSet={newRequestHeadersSet}
              newRequestStreamsSet={newRequestStreamsSet}
            />
            <CookieEntryForm
              newRequestCookies={newRequestCookies}
              newRequestBody={newRequestBody}
              newRequestCookiesSet={newRequestCookiesSet}
            />
          </div>
        </span>
        {/* SSE TOGGLE SWITCH */}
        <div className="field mt-2 flex-space-around">
          <SendRequestButton onClick={sendNewRequest} />
          <FormControlLabel
            control={<Switch />}
            label="Server Sent Events"
            onChange={() => newRequestSSESet(!isSSE)}
            checked={isSSE}
          />
          <NewRequestButton onClick={addNewRequest} />
        </div>
        {method !== 'GET' && (
          <BodyEntryForm
            warningMessage={warningMessage}
            newRequestBody={newRequestBody}
            newRequestBodySet={newRequestBodySet}
            newRequestHeaders={newRequestHeaders}
            newRequestHeadersSet={newRequestHeadersSet}
          />
        )}
        <TestContainer />
        <TestEntryForm
          isWebSocket={false}
          newTestContentSet={newTestContentSet}
          testContent={testContent}
        />
      </div>
    </Box>
  );
}
