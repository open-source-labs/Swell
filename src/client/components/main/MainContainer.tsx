import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { ReqRes, $TSFixMe, $TSFixMeObject } from '../../../types';

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

/**@todo switch to hooks? */
const mapStateToProps = (store: RootState) => {
  return {
    reqResArray: store.reqRes.reqResArray,
    newRequestFields: store.newRequestFields,
    newRequestHeaders: store.newRequest.newRequestHeaders,
    newRequestStreams: store.newRequest.newRequestStreams,
    newRequestBody: store.newRequest.newRequestBody,
    newRequestOpenAPI: store.newRequestOpenApi,
    newRequestCookies: store.newRequest.newRequestCookies,
    newRequestSSE: store.newRequest.newRequestSSE,
    warningMessage: store.warningMessage,
    introspectionData: store.introspectionData,
  };
};

/**@todo switch to hooks? */
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  reqResItemAdded: (reqRes: ReqRes) => {
    dispatch(ReqResSlice.reqResItemAdded(reqRes));
  },
  setWarningMessage: (message: $TSFixMe) => {
    dispatch(setWarningMessage(message));
  },
  // setComposerDisplay: (composerDisplay) => {
  //   dispatch(setComposerDisplay(composerDisplay));
  // },
  newRequestHeadersSet: (requestHeadersObj: $TSFixMeObject) => {
    dispatch(newRequestHeadersSet(requestHeadersObj));
  },
  newRequestStreamsSet: (requestStreamsObj: $TSFixMeObject) => {
    dispatch(newRequestStreamsSet(requestStreamsObj));
  },
  fieldsReplaced: (requestFields: $TSFixMe) => {
    dispatch(fieldsReplaced(requestFields));
  },
  newRequestBodySet: (requestBodyObj: $TSFixMeObject) => {
    dispatch(newRequestBodySet(requestBodyObj));
  },
  newTestContentSet: (testContent: $TSFixMe) => {
    dispatch(newTestContentSet(testContent));
  },
  newRequestCookiesSet: (requestCookiesObj: $TSFixMeObject) => {
    dispatch(newRequestCookiesSet(requestCookiesObj));
  },
  newRequestSSESet: (requestSSEBool: boolean) => {
    dispatch(newRequestSSESet(requestSSEBool));
  },
  openApiRequestsReplaced: (parsedDocument: $TSFixMe) => {
    dispatch(openApiRequestsReplaced(parsedDocument));
  },
  composerFieldsReset: () => {
    dispatch(composerFieldsReset());
  },
  setWorkspaceActiveTab: (tabName: $TSFixMe) => {
    dispatch(setWorkspaceActiveTab(tabName));
  },
});

function MainContainer(props: $TSFixMeObject) {
  return (
    <Box sx={{ width: '75%' }}>
      <Split direction="vertical" gutterSize={5} style={{ height: '100%' }}>
        <Box sx={{ display: 'flex' }}>
          <Routes>
            <Route path="/" element={<Http2Composer {...props} />} />
            <Route path="/graphql" element={<GraphQLComposer {...props} />} />
            <Route path="/grpc" element={<GRPCComposer {...props} />} />
            <Route path="/websocket" element={<WebSocketComposer {...props} />} />
            <Route path="/webrtc" element={<WebRTCComposer {...props} />} />
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

export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);

