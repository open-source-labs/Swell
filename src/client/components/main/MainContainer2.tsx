import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../../toolkit-refactor/hooks';
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
  const resReqArray = useAppSelector(
    (state) => state.reqRes.reqResArray
  );
  const newRequestFields = useAppSelector(
    (state) => state.newRequestFields
  );
  const newRequestHeaders = useAppSelector(
    (state) => state.newRequest.newRequestHeaders
  );
  const newRequestStreams = useAppSelector(
    (state) => state.newRequest.newRequestStreams
  );
  const newRequestBody = useAppSelector(
    (state) => state.newRequest.newRequestBody
  );
  //   const newRequestOpenAPI = useSelector(
  //     (state: RootState) => state.newRequestOpenApi
  //   );
  const newRequestCookies = useAppSelector(
    (state) => state.newRequest.newRequestCookies
  );
  const newRequestSSE = useAppSelector(
    (state) => state.newRequest.newRequestSSE
  );
  const warningMessage = useAppSelector(
    (state) => state.warningMessage
  );
  const introspectionData = useAppSelector(
    (state) => state.introspectionData
  );

  const dispatch = useAppDispatch()

  const dispatchReqResItemAdded = (reqRes: ReqRes) => {
    dispatch(ReqResSlice.reqResItemAdded(reqRes));
  };
  const dispatchSetWarningMessage = (message: $TSFixMe) => {
    dispatch(setWarningMessage(message));
  };
  //pre-refactor had a setComposerDisplay dispatch that was imported from uiSlice and commented out, must be a relic that was unused but leaving this comment for future groups that may look for it
  const dispatchNewRequestHeadersSet = (requestHeadersObj: $TSFixMeObject) => {
    dispatch(newRequestHeadersSet(requestHeadersObj));
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

