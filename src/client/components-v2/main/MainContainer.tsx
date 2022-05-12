import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions';

// Import local components.
import Http2Composer from './Http2Composer';
import GraphQLComposer from './GraphQLComposer';
import ResponsePaneContainer from './response/ResponsePaneContainer';

// Import MUI components
import { Box } from '@mui/material';

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

const mapDispatchToProps = (dispatch) => ({
  reqResAdd: (reqRes) => {
    dispatch(actions.reqResAdd(reqRes));
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
  setNewRequestCookies: (requestCookiesObj) => {
    dispatch(actions.setNewRequestCookies(requestCookiesObj));
  },
  setNewRequestSSE: (requestSSEBool) => {
    dispatch(actions.setNewRequestSSE(requestSSEBool));
  },
  setNewRequestsOpenAPI: (parsedDocument) => {
    dispatch(actions.setNewRequestsOpenAPI(parsedDocument));
  },
  resetComposerFields: () => {
    dispatch(actions.resetComposerFields());
  },
  setWorkspaceActiveTab: (tabName) => {
    dispatch(actions.setWorkspaceActiveTab(tabName));
  },
});

function MainContainer(props) {
  return(
    // TODO: change width to 100% after porting to react router
    <Box sx={{p: 1.5, width: '50%'}}>
      <Box>
        <Routes>
          <Route
            path="/"
            element={<Http2Composer {...props} />}
          />
          <Route
            path="/graphql"
            element={<GraphQLComposer {...props} />}
          />
          <Route
            path="/grpc"
            element={<p>/grpc</p>}
          />
          <Route
            path="/websocket"
            element={<p></p>}
          />
          <Route
            path="/webrtc"
            element={<p></p>}
          />
          <Route
            path="/openapi"
            element={<p></p>}
          />
          <Route
            path="/webhook"
            element={<p></p>}
          />
        </Routes>
        <ResponsePaneContainer />
      </Box>
    </Box>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(MainContainer)
