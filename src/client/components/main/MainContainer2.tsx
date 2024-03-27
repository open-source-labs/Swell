import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  ReqRes,
  $TSFixMe,
  $TSFixMeObject,
  RequestWebRTC,
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
import { AppDispatch, RootState } from '../../toolkit-refactor/store';
import Split from 'react-split';

function MainContainer2() {
  const resReqArray = useSelector(
    (state: RootState) => state.reqRes.reqResArray
  );
  const newRequestFields = useSelector(
    (state: RootState) => state.newRequestFields
  );
  const newRequestHeaders = useSelector(
    (state: RootState) => state.newRequest.newRequestHeaders
  );
  const newRequestStreams = useSelector(
    (state: RootState) => state.newRequest.newRequestStreams
  );
  const newRequestBody = useSelector(
    (state: RootState) => state.newRequest.newRequestBody
  );
  //   const newRequestOpenAPI = useSelector(
  //     (state: RootState) => state.newRequestOpenApi
  //   );
  const newRequestCookies = useSelector(
    (state: RootState) => state.newRequest.newRequestCookies
  );
  const newRequestSSE = useSelector(
    (state: RootState) => state.newRequest.newRequestSSE
  );
  const warningMessage = useSelector(
    (state: RootState) => state.warningMessage
  );
  const introspectionData = useSelector(
    (state: RootState) => state.introspectionData
  );

  const dispatch = useDispatch();

  const dispatchReqResItemAdded = (reqRes: ReqRes, dispatch: AppDispatch) => {
    dispatch(ReqResSlice.reqResItemAdded(reqRes));
  };
  const dispatchWarningMessage = (message: $TSFixMe, dispatch: AppDispatch) => {
    dispatch(setWarningMessage(message));
  }

  return (
    <Box sx={{ width: '75%' }}>
      <Split direction="vertical" gutterSize={5} style={{ height: '100%' }}>
        <Box sx={{ display: 'flex' }}>
          <Routes>
            <Route path="/webrtc" element={<WebRTCComposer />} />
          </Routes>
        </Box>
        <ResponsePaneContainer />
      </Split>
    </Box>
  );
}

export default MainContainer2;

