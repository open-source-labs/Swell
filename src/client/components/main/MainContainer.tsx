import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../toolkit-refactor/hooks';
import {
  ReqRes,
  $TSFixMe,
  $TSFixMeObject,
  RequestWebRTC,
  ValidationMessage,
  MainContainerProps,
  NewRequestHeaders,
  NewRequestStreams,
  NewRequestFields,
} from '../../../types';

import * as ReqResSlice from '../../toolkit-refactor/slices/reqResSlice';

import {
  composerFieldsReset,
  newRequestSSESet,
  newRequestCookiesSet,
  newRequestStreamsSet,
  newRequestBodySet,
  newRequestHeadersSet,
} from '../../toolkit-refactor/slices/newRequestSlice';

import { openApiRequestsReplaced } from '../../toolkit-refactor/slices/newRequestOpenApiSlice';

import {
  setWorkspaceActiveTab,
  /*, setComposerDisplay */
} from '../../toolkit-refactor/slices/uiSlice';


import {
  fieldsReplaced,
  newTestContentSet,
} from '../../toolkit-refactor/slices/newRequestFieldsSlice';
import { setWarningMessage } from '../../toolkit-refactor/slices/warningMessageSlice';

// Import local components.
import Http2Composer from './http2-composer/Http2Composer';
import GraphQLComposer from './GraphQL-composer/GraphQLComposer';
import GRPCComposer from './GRPC-composer/GRPCComposer';
import WebSocketComposer from './WebSocket-composer/WebSocketComposer';
import WebRTCComposer from './WebRTC-composer/WebRTCComposer';
import OpenAPIComposer from './OpenAPI-composer/OpenAPIComposer';
import WebhookComposer from './WebHook-composer/WebhookComposer';
import TRPCComposer from './TRPC-composer/TRPCComposer';
import MockServerComposer from './MockServer-composer/MockServerComposer';
import ResponsePaneContainer from './response-composer/ResponsePaneContainer';

// Import MUI components
import { Box } from '@mui/material';
import Split from 'react-split';
import { PayloadAction } from '@reduxjs/toolkit';

function MainContainer() {
  const dispatch = useAppDispatch();

  // Hooks conversion while keeping Prop drilling for core functionality
  // Accessing state from redux store, types inferred
  const reqResArray = useAppSelector((state) => state.reqRes.reqResArray);
  const newRequestFields = useAppSelector((state) => state.newRequestFields);
  const newRequestHeaders = useAppSelector(
    (state) => state.newRequest.newRequestHeaders
  );
  const newRequestStreams = useAppSelector(
    (state) => state.newRequest.newRequestStreams
  );
  const newRequestBody = useAppSelector(
    (state) => state.newRequest.newRequestBody
  );
  //   const newRequestOpenAPI = useAppSelector((state) => state.newRequestOpenApi); // Commented out in original MainContainer before hooks conversion (?)
  const newRequestCookies = useAppSelector(
    (state) => state.newRequest.newRequestCookies
  );
  const newRequestSSE = useAppSelector(
    (state) => state.newRequest.newRequestSSE
  );
  const warningMessage = useAppSelector((state) => state.warningMessage);
  const introspectionData = useAppSelector((state) => state.introspectionData);

  // Dispatching actions
  const reqResItemAdded = (reqRes: ReqRes) =>
    dispatch(ReqResSlice.reqResItemAdded(reqRes));
  const setWarningMessageAction = (message: ValidationMessage) =>
    dispatch(setWarningMessage(message));
  //   const setComposerDisplay = (composerDisplay) =>
  //     dispatch(setComposerDisplay(composerDisplay)); // Kept this in from old MainContainer for posterity
  const newRequestHeadersSetAction = (requestHeadersObj: NewRequestHeaders) =>
    dispatch(newRequestHeadersSet(requestHeadersObj));
  const newRequestStreamsSetAction = (requestStreamsObj: NewRequestStreams) =>
    dispatch(newRequestStreamsSet(requestStreamsObj));
  const fieldsReplacedAction = (requestFields: NewRequestFields) =>
    dispatch(fieldsReplaced(requestFields));
  const newRequestBodySetAction = (requestBodyObj: $TSFixMeObject) =>
    dispatch(newRequestBodySet(requestBodyObj));
  const newTestContentSetAction = (testContent: $TSFixMe) =>
    dispatch(newTestContentSet(testContent));
  const newRequestCookiesSetAction = (requestCookiesObj: $TSFixMeObject) =>
    dispatch(newRequestCookiesSet(requestCookiesObj));
  const newRequestSSESetAction = (requestSSEBool: boolean) =>
    dispatch(newRequestSSESet(requestSSEBool));
  const openApiRequestsReplacedAction = (parsedDocument: $TSFixMe) =>
    dispatch(openApiRequestsReplaced(parsedDocument));
  const composerFieldsResetAction = () => dispatch(composerFieldsReset());
  const setWorkspaceActiveTabAction = (tabName: string) =>
    dispatch(setWorkspaceActiveTab(tabName));

  const props: MainContainerProps = {
    reqResArray,
    newRequestFields,
    newRequestHeaders,
    newRequestStreams,
    newRequestBody,
    newRequestCookies,
    newRequestSSE,
    warningMessage,
    introspectionData,
    reqResItemAdded,
    setWarningMessage: setWarningMessageAction,
    newRequestHeadersSet: newRequestHeadersSetAction,
    newRequestStreamsSet: newRequestStreamsSetAction,
    fieldsReplaced: fieldsReplacedAction,
    newRequestBodySet: newRequestBodySetAction,
    newTestContentSet: newTestContentSetAction,
    newRequestCookiesSet: newRequestCookiesSetAction,
    newRequestSSESet: newRequestSSESetAction,
    openApiRequestsReplaced: openApiRequestsReplacedAction,
    composerFieldsReset: composerFieldsResetAction,
    setWorkspaceActiveTab: setWorkspaceActiveTabAction,
  };
  return (
    <Box sx={{ width: '75%' }}>
      <Split direction="vertical" gutterSize={5} style={{ height: '100%' }}>
        <Box sx={{ display: 'flex' }}>
          <Routes>
            <Route path="/" element={<Http2Composer {...props} />} />
            <Route path="/graphql" element={<GraphQLComposer {...props} />} />
            <Route path="/grpc" element={<GRPCComposer {...props} />} />
            <Route
              path="/websocket"
              element={<WebSocketComposer {...props} />}
            />
            {/* WebRTC has been completely refactored to hooks - no props needed */}
            <Route path="/webrtc" element={<WebRTCComposer />} />
            <Route path="/openapi" element={<OpenAPIComposer {...props} />} />
            <Route path="/webhook" element={<WebhookComposer {...props} />} />
            <Route path="/trpc" element={<TRPCComposer {...props} />} />
            <Route
              path="/mockserver"
              element={<MockServerComposer {...props} />}
            />
          </Routes>
        </Box>
        <ResponsePaneContainer />
      </Split>
    </Box>
  );
}

export default MainContainer;

