import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { connect } from 'react-redux';

/**@todo delete after slice conversion complete */
import * as actions from '../../features/business/businessSlice';
import * as uiactions from '../../features/ui/uiSlice';

import { reqResItemAdded } from '../../toolkit-refactor/reqRes/reqResSlice';
import {
  composerFieldsReset,
  newRequestSSESet,
  newRequestCookiesSet,
} from '../../toolkit-refactor/newRequest/newRequestSlice';

// Import local components.
import Http2Composer from './http2-composer/Http2Composer';
import GraphQLComposer from './GraphQLComposer';
import GRPCComposer from './GRPCComposer';
import WebSocketComposer from './WebSocketComposer';
import WebRTCComposer from './WebRTCComposer';
import OpenAPIComposer from './OpenAPIComposer';
import WebhookComposer from './WebhookComposer';
import ResponsePaneContainer from './response/ResponsePaneContainer';

// Import MUI components
import { Box, Divider } from '@mui/material';

/**@todo switch to hooks? */
const mapStateToProps = (store) => {
  return {
    reqResArray: store.business.reqResArray,
    newRequestFields: store.business.newRequestFields,
    newRequestHeaders: store.business.newRequestHeaders,
    newRequestStreams: store.business.newRequestStreams,
    newRequestBody: store.business.newRequestBody,
    newRequestsOpenAPI: store.business.newRequestsOpenAPI,
    newRequestCookies: store.business.newRequestCookies,
    newRequestSSE: store.business.newRequestSSE,
    currentTab: store.business.currentTab,
    warningMessage: store.business.warningMessage,
    introspectionData: store.business.introspectionData,
    webrtcData: store.business.webrtcData,
  };
};

/**@todo switch to hooks? */
const mapDispatchToProps = (dispatch) => ({
  reqResItemAdded: (reqRes) => {
    dispatch(reqResItemAdded(reqRes));
  },
  setComposerWarningMessage: (message) => {
    dispatch(actions.setComposerWarningMessage(message));
  },
  // setComposerDisplay: (composerDisplay) => {
  //   dispatch(actions.setComposerDisplay(composerDisplay));
  // },
  setNewRequestHeaders: (requestHeadersObj) => {
    dispatch(actions.setNewRequestHeaders(requestHeadersObj));
  },
  setNewRequestStreams: (requestStreamsObj) => {
    dispatch(actions.setNewRequestStreams(requestStreamsObj));
  },
  setNewRequestFields: (requestFields) => {
    dispatch(actions.setNewRequestFields(requestFields));
  },
  setNewRequestBody: (requestBodyObj) => {
    dispatch(actions.setNewRequestBody(requestBodyObj));
  },
  setNewTestContent: (testContent) => {
    dispatch(actions.setNewTestContent(testContent));
  },
  newRequestCookiesSet: (requestCookiesObj) => {
    dispatch(newRequestCookiesSet(requestCookiesObj));
  },
  newRequestSSESet: (requestSSEBool) => {
    dispatch(newRequestSSESet(requestSSEBool));
  },
  setNewRequestsOpenAPI: (parsedDocument) => {
    dispatch(actions.setNewRequestsOpenAPI(parsedDocument));
  },
  composerFieldsReset: () => {
    dispatch(composerFieldsReset());
  },
  setWorkspaceActiveTab: (tabName) => {
    dispatch(uiactions.setWorkspaceActiveTab(tabName));
  },
});

function MainContainer(props) {
  return (
    <Box
      sx={{
        width: '75%',
        // overflowY: 'scroll',
        // display: 'flex',
        // flexDirection: 'column'
      }}
    >
      <Routes>
        <Route path="/" element={<Http2Composer {...props} />} />
        <Route path="/graphql" element={<GraphQLComposer {...props} />} />
        <Route path="/grpc" element={<GRPCComposer {...props} />} />
        <Route path="/websocket" element={<WebSocketComposer {...props} />} />
        <Route path="/webrtc" element={<WebRTCComposer {...props} />} />
        <Route path="/openapi" element={<OpenAPIComposer {...props} />} />
        <Route path="/webhook" element={<WebhookComposer {...props} />} />
      </Routes>
      <Divider
        orientation="horizontal"
        sx={{ borderBottomWidth: 2, background: '#51819b' }}
      />
      <ResponsePaneContainer />
    </Box>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);
