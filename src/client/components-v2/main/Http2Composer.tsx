import React from 'react';
import { v4 as uuid } from 'uuid';
// Give composer access to both business Redux store slice and all actions
import { useDispatch } from 'react-redux';
import * as actions from './../../features/business/businessSlice';
import * as uiactions from './../../features/ui/uiSlice';
// Import controllers
import connectionController from '../../controllers/reqResController';
import historyController from '../../controllers/historyController';
// Import local components
// TODO: refactor all of the below components to use MUI, place them in a new "components" folder
import RestMethodAndEndpointEntryForm from '../../components/composer/NewRequest/RestMethodAndEndpointEntryForm';
import HeaderEntryForm from '../../components/composer/NewRequest/HeaderEntryForm';
import CookieEntryForm from '../../components/composer/NewRequest/CookieEntryForm';
import SendRequestButton from '../../components/composer/NewRequest/SendRequestButton';
import NewRequestButton from '../../components/composer/NewRequest/NewRequestButton';
import BodyEntryForm from '../../components/composer/NewRequest/BodyEntryForm';
import TestEntryForm from '../../components/composer/NewRequest/TestEntryForm';
// Import MUI components
import { Box } from '@mui/material';

// Translated from RestContainer.jsx
export default function Http2Composer(props) {
  const dispatch = useDispatch();

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
    setNewRequestFields,
    resetComposerFields,
    setNewRequestBody,
    setNewTestContent,
    setNewRequestHeaders,
    setNewRequestCookies,
    setNewRequestStreams,
    setNewRequestSSE,
    setComposerWarningMessage,
    setWorkspaceActiveTab,
    reqResAdd
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

  const {
    JSONFormatted,
    rawType,
    bodyContent,
    bodyVariables,
    bodyType,
  } = newRequestBody;

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
    };
    const validationMessage: ValidationMessage = {}
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

  // TODO: what does this function do?
  const sendNewRequest = () => {
    const warnings = requestValidationCheck();
    if (Object.keys(warnings).length > 0) {
      setComposerWarningMessage(warnings);
      return;
    }

    let reqRes;
    const protocol = url.match(/(https?:\/\/)|(wss?:\/\/)/)[0];
    // HTTP && GRAPHQL QUERY & MUTATION REQUESTS
    if (!/wss?:\/\//.test(protocol) && !gRPC) {
      const URIWithoutProtocol = `${url.split(protocol)[1]}/`;
      URIWithoutProtocol; // deleteable ???
      const host = protocol + URIWithoutProtocol.split('/')[0];
      let path = `/${URIWithoutProtocol.split('/')
        .splice(1)
        .join('/')
        .replace(/\/{2,}/g, '/')}`;
      if (path.charAt(path.length - 1) === '/' && path.length > 1) {
        path = path.substring(0, path.length - 1);
      }
      path = path.replace(/https?:\//g, 'http://');
      reqRes = {
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
          headers: headersArr.filter((header) => header.active && !!header.key),
          cookies: cookiesArr.filter((cookie) => cookie.active && !!cookie.key),
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
          headers: null,
          events: null,
        },
        checked: false,
        minimized: false,
        tab: currentTab,
      };
    }

    // add request to history
    historyController.addHistoryToIndexedDb(reqRes);
    reqResAdd(reqRes);
    // dispatch(actions.scheduledReqResUpdate(reqRes));

    //reset for next request
    resetComposerFields();
    // dispatch(actions.setResponsePaneActiveTab('events'));
    // dispatch(actions.setSidebarActiveTab('composer'));

    connectionController.openReqRes(reqRes.id);
    dispatch(
      actions.saveCurrentResponseData(
        reqRes,
        'singleReqResContainercomponentSendHandler'
      )
    );
  };

  // TODO: what does this function do?
  const addNewRequest = () => {
    const warnings = requestValidationCheck();
    if (Object.keys(warnings).length > 0) {
      setComposerWarningMessage(warnings);
      return;
    }

    let reqRes;
    const protocol = url.match(/(https?:\/\/)|(wss?:\/\/)/)[0];
    // HTTP && GRAPHQL QUERY & MUTATION REQUESTS
    if (!/wss?:\/\//.test(protocol) && !gRPC) {
      const URIWithoutProtocol = `${url.split(protocol)[1]}/`;
      URIWithoutProtocol; // deleteable ???
      const host = protocol + URIWithoutProtocol.split('/')[0];
      let path = `/${URIWithoutProtocol.split('/')
        .splice(1)
        .join('/')
        .replace(/\/{2,}/g, '/')}`;
      if (path.charAt(path.length - 1) === '/' && path.length > 1) {
        path = path.substring(0, path.length - 1);
      }
      path = path.replace(/https?:\//g, 'http://');
      reqRes = {
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
          headers: headersArr.filter((header) => header.active && !!header.key),
          cookies: cookiesArr.filter((cookie) => cookie.active && !!cookie.key),
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
          headers: null,
          events: null,
        },
        checked: false,
        minimized: false,
        tab: currentTab,
      };
    }

    // add request to history
    historyController.addHistoryToIndexedDb(reqRes);
    reqResAdd(reqRes);

    //reset for next request
    resetComposerFields();
    setWorkspaceActiveTab('workspace');
  };

  const handleSSEPayload = (e) => {
    setNewRequestSSE(e.target.checked);
  };

  return(
    <Box className="is-flex-grow-3 add-vertical-scroll"
    style={{ overflowX: 'hidden' }}
    id = "composer-http2">
        <RestMethodAndEndpointEntryForm
          newRequestFields={newRequestFields}
          newRequestBody={newRequestBody}
          setNewTestContent={setNewTestContent}
          setNewRequestFields={setNewRequestFields}
          setNewRequestBody={setNewRequestBody}
          warningMessage={warningMessage}
          setComposerWarningMessage={setComposerWarningMessage}
        />
        <span className="inputs">
          <div>
            <HeaderEntryForm
              newRequestHeaders={newRequestHeaders}
              newRequestStreams={newRequestStreams}
              newRequestBody={newRequestBody}
              newRequestFields={newRequestFields}
              setNewRequestHeaders={setNewRequestHeaders}
              setNewRequestStreams={setNewRequestStreams}
            />
            <CookieEntryForm
              newRequestCookies={newRequestCookies}
              newRequestBody={newRequestBody}
              setNewRequestCookies={setNewRequestCookies}
            />
          </div>
          <div className="is-3rem-footer is-clickable restReqBtns">
            <SendRequestButton onClick={sendNewRequest} />
            <p> --- or --- </p>
            <NewRequestButton onClick={addNewRequest} />
          </div>
        </span>
        {/* SSE TOGGLE SWITCH */}
        <div className="field mt-2">
          <span className="composer-section-title mr-3">
            Server Sent Events
          </span>
          <input
            id="SSEswitch"
            type="checkbox"
            className="switch is-outlined is-warning"
            onChange={(e) => {
              handleSSEPayload(e);
            }}
            checked={isSSE}
          />
          <label htmlFor="SSEswitch" />
        </div>
        {method !== 'GET' && (
          <BodyEntryForm
            warningMessage={warningMessage}
            newRequestBody={newRequestBody}
            setNewRequestBody={setNewRequestBody}
            newRequestHeaders={newRequestHeaders}
            setNewRequestHeaders={setNewRequestHeaders}
          />
        )}
        <TestEntryForm
          setNewTestContent={setNewTestContent}
          testContent={testContent}
        />
    </Box>
  )
}
