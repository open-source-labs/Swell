import React from 'react';
import { v4 as uuid } from 'uuid';
import { useDispatch } from 'react-redux';

import { responseDataSaved } from '../../../toolkit-refactor/reqRes/reqResSlice';
import {
  setResponsePaneActiveTab,
  setSidebarActiveTab,
} from '../../../toolkit-refactor/ui/uiSlice';

// Import controllers
import connectionController from '../../../controllers/reqResController';
import historyController from '../../../controllers/historyController';

/**
 * @todo Refactor all of the below components to use MUI, place them in a new
 * "components" folder
 */
import RestMethodAndEndpointEntryForm from '../new-request/RestMethodAndEndpointEntryForm';
import HeaderEntryForm from '../new-request/HeaderEntryForm';
import CookieEntryForm from '../new-request/CookieEntryForm';
import SendRequestButton from '../new-request/SendRequestButton';
import NewRequestButton from '../new-request/NewRequestButton';
import BodyEntryForm from '../new-request/BodyEntryForm';
import TestEntryForm from '../new-request/TestEntryForm';
// Import MUI components
import { Box, FormControlLabel, Switch } from '@mui/material';
import { CookieOrHeader, ReqRes } from '../../../../types';

import TestContainer from '../../workspace/TestContainer';

// Translated from RestContainer.jsx
export default function Http2Composer(props) {
  const dispatch = useDispatch();
  // Destructuring store props.
  const {
    currentTab,
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

  const { protoPath } = newRequestSSE;
  const { headersArr } = newRequestHeaders;
  const { cookiesArr } = newRequestCookies;
  const { isSSE } = newRequestSSE;

  /**
   * Validates the request before it is sent.
   * @returns ValidationMessage
   */
  const requestValidationCheck = () => {
    interface ValidationMessage {
      uri?: string;
      json?: string;
    }
    const validationMessage: ValidationMessage = {};
    // Error conditions...
    if (/https?:\/\/$|wss?:\/\/$/.test(url)) {
      //if url is only http/https/ws/wss://
      validationMessage.uri = 'Enter a valid URI';
    }
    if (!/(https?:\/\/)|(wss?:\/\/)/.test(url)) {
      //if url doesn't have http/https/ws/wss://
      validationMessage.uri = 'Enter a valid URI';
    }
    if (!JSONFormatted && rawType === 'application/json') {
      validationMessage.json = 'Please fix JSON body formatting errors';
    }
    return validationMessage;
  };

  const composeReqRes = (): ReqRes => {
    const protocol: string = url.match(/(https?:\/\/)/)[0];
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
      protocol: url.match(/https?:\/\//)[0],
      host,
      path,
      url,
      webrtc,
      graphQL,
      gRPC,
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
      tab: currentTab,
    };
  };
  /** @todo Figure out what this function does */
  const sendNewRequest = () => {
    const warnings = requestValidationCheck();
    if (Object.keys(warnings).length > 0) {
      setWarningMessage(warnings);
      return;
    }
    const reqRes: ReqRes = composeReqRes();

    // add request to history
    historyController.addHistoryToIndexedDb(reqRes);
    reqResItemAdded(reqRes);
    // dispatch(scheduledReqResAdded(reqRes));

    //reset for next request
    composerFieldsReset();
    dispatch(setResponsePaneActiveTab('events'));
    dispatch(setSidebarActiveTab('composer'));

    connectionController.openReqRes(reqRes.id);
    dispatch(responseDataSaved(reqRes));
  };

  /** @todo Figure out what this function does */
  const addNewRequest = () => {
    const warnings = requestValidationCheck();
    if (Object.keys(warnings).length > 0) {
      setWarningMessage(warnings);
      return;
    }
    const reqRes: ReqRes = composeReqRes();

    // add request to history
    historyController.addHistoryToIndexedDb(reqRes);
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
          onEndpointChange={(input: string) => undefined}
          placeholder='Enter URL or paste text' 
          value={undefined}
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
          newTestContentSet={newTestContentSet}
          testContent={testContent}
        />
      </div>
    </Box>
  );
}
