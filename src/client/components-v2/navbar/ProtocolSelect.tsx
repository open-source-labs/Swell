import React from 'react';
import { Link } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';

import * as actions from '../../actions/actions';

// Import MUI components.
import { Box, Button } from '@mui/material';

const mapStateToProps = (store) => {
  return {
    reqResArray: store.business.reqResArray,
    // composerDisplay: store.ui.composerDisplay,
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


const pages = [
  { name: 'HTTP2', route: '/' },
  { name: 'GRAPHQL', route: '/graphql' },
  { name: 'GRPC', route: '/grpc' },
  { name: 'WEB SOCKET', route: '/websocket' },
  { name: 'WEBRTC', route: '/webrtc' },
  { name: 'OPENAPI', route: '/openapi' },
  { name: 'WEBHOOK', route: '/webhook' },
]

function ProtocolSelect(props) {

  return(
    <Box
      key="page-selector"
      sx={{
        flexGrow: 1,
        display: { xs: 'none', md: 'flex' },
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {pages.map((page) => (
        <Link
          key={page.name}
          to={page.route}
          >
          <Button
            key={page.name}
            variant="contained"
            color="primary"
            sx={{
              m: 1
            }}>
            {page.name}
          </Button>
        </Link>
      ))}
    </Box>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(ProtocolSelect);
