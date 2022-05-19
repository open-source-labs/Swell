import React from 'react';
import { Link } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';

// Import actions so that the navbar can interact with the Redux store.
import * as actions from '../../features/business/businessSlice';
import * as uiactions from '../../features/ui/uiSlice';

// Import MUI components.
import { styled } from '@mui/system';
import { Box, Button } from '@mui/material';
import ButtonUnstyled, { buttonUnstyledClasses } from '@mui/base/ButtonUnstyled';

const blue = {
  500: '#51819b',
  600: '#51819b',
  700: '#7ebdde',
};

const white = {
  500: '#f0f6fa',
}

const CustomButton = styled(ButtonUnstyled)`
  font-family: IBM Plex Sans, sans-serif;
  font-weight: bold;
  font-size: 0.875rem;
  background-color: ${white[500]};
  padding: 10px 0px;
  border-radius: 3px;
  color: ${blue[500]};
  transition: all 150ms ease;
  cursor: pointer;
  border: none;
  width: 8vw;

  &:hover {
    background-color: ${blue[600]};
  }

  &.${buttonUnstyledClasses.active} {
    background-color: ${blue[700]};
  }

  &.${buttonUnstyledClasses.focusVisible} {
    box-shadow: 0 4px 20px 0 rgba(61, 71, 82, 0.1), 0 0 0 5px rgba(0, 127, 255, 0.5);
    outline: none;
  }

  &.${buttonUnstyledClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

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
    dispatch(uiactions.setWorkspaceActiveTab(tabName));
  },
});

/**
 * name: The display name for the button.
 * route: The React Router route to redirect to on click.
 * value: The value of the button used to update the Redux store.
 */
const pages = [
  { name: 'HTTP/2', route: '/', value: 'rest' },
  { name: 'GraphQL', route: '/graphql', value: 'graphQL' },
  { name: 'gRPC', route: '/grpc', value: 'grpc' },
  { name: 'WebSocket', route: '/websocket', value: 'ws' },
  { name: 'WebRTC', route: '/webrtc', value: 'webrtc' },
  { name: 'OpenAPI', route: '/openapi', value: 'openapi' },
  { name: 'Webhook', route: '/webhook', value: 'webhook' },
]

/**
 * ProtocolSelect is a component in the navbar that alters the redux store based on the protocol that is selected.
 * It is responsible for kicking off the process of creating default values for the composer containers.
 * Click a protocol button -> Alter the Redux store accordingly -> Route to the appropriate "main" container
 */
function ProtocolSelect(props) {
  /**
   * Alters the Redux store when a protocol is selected.
   * @param network
   */
  const onProtocolSelect = (network) => {
    if (props.warningMessage.uri) {
      const warningMessage = { ...props.warningMessage };
      delete warningMessage.uri;
      props.setComposerWarningMessage({ ...warningMessage });
    }
    props.setComposerWarningMessage({});
    switch (network) {
      case 'graphQL': {
        props.resetComposerFields();
        props.setNewRequestFields({
          ...props.newRequestFields,
          protocol: '',
          url: props.newRequestFields.gqlUrl,
          method: 'QUERY',
          graphQL: true,
          gRPC: false,
          webrtc: false,
          webhook: false,
          network,
          testContent: '',
        });
        props.setNewRequestBody({
          ...props.newRequestBody,
          bodyType: 'GQL',
          bodyVariables: '',
        });
        break;
      }
      case 'rest': {
        props.resetComposerFields();
        props.setNewRequestFields({
          ...props.newRequestFields,
          protocol: '',
          url: props.newRequestFields.restUrl,
          method: 'GET',
          graphQL: false,
          webrtc: false,
          gRPC: false,
          webhook: false,
          network,
          testContent: '',
        });
        props.setNewRequestBody({
          ...props.newRequestBody,
          bodyType: 'none',
          bodyContent: ``,
        });
        break;
      }
      case 'openapi': {
        props.resetComposerFields();
        props.setNewRequestFields({
          ...props.newRequestFields,
          protocol: '',
          url: '',
          method: 'GET',
          graphQL: false,
          gRPC: false,
          ws: false,
          webhook: false,
          network: 'openapi',
          testContent: '',
        });
        props.setNewRequestBody({
          ...props.newRequestBody,
          bodyType: 'none',
          bodyContent: '',
        });
        break;
      }
      case 'grpc': {
        props.resetComposerFields();
        props.setNewRequestFields({
          ...props.newRequestFields,
          protocol: '',
          url: props.newRequestFields.grpcUrl,
          method: '',
          graphQL: false,
          gRPC: true,
          webrtc: false,
          webhook: false,
          network,
          testContent: '',
        });
        props.setNewRequestBody({
          ...props.newRequestBody,
          bodyType: 'GRPC',
          bodyContent: ``,
        });
        break;
      }
      case 'ws': {
        props.resetComposerFields();
        props.setNewRequestFields({
          ...props.newRequestFields,
          protocol: '',
          url: props.newRequestFields.wsUrl,
          method: '',
          graphQL: false,
          gRPC: false,
          webrtc: false,
          webhook: false,
          network,
          testContent: '',
        });
        props.setNewRequestBody({
          ...props.newRequestBody,
          bodyType: 'none',
          bodyContent: '',
        });
        break;
      }
      case 'webrtc': {
        props.resetComposerFields();
        props.setNewRequestFields({
          ...props.newRequestFields,
          protocol: '',
          url: props.newRequestFields.webrtcUrl,
          method: 'WebRTC',
          graphQL: false,
          gRPC: false,
          ws: false,
          webrtc: true,
          webhook: false,
          network,
          testContent: '',
        });
        props.setNewRequestBody({
          ...props.newRequestBody,
          bodyType: 'stun-ice',
          bodyContent: {
            iceConfiguration: {
              iceServers: [
                {
                  urls: 'stun:stun1.l.google.com:19302',
                },
              ],
            },
          },
        });
        break;
      }
      case 'webhook': {
        props.resetComposerFields();
        props.setNewRequestFields({
          ...props.newRequestFields,
          protocol: '',
          //??? might need to fix url vvv if we want to pass our url api from the state
          url: '',
          method: 'Webhook',
          graphQL: false,
          gRPC: false,
          ws: false,
          webrtc: false,
          webhook: true,
          // vvv wat dis, don't think we neeed
          network,
          testContent: '',
        });
        props.setNewRequestBody({
          ...props.newRequestBody,
          bodyType: 'none',
        });
        break;
      }
      default:
    }
  };

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
          <CustomButton
            key={page.name}
            // variant="contained"
            // color="primary"
            onClick={() => {
              console.log(page.value)
              onProtocolSelect(page.value)}
            }
            sx={{
              m: 1
            }}>
            {page.name}
          </CustomButton>
        </Link>
      ))}
    </Box>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(ProtocolSelect);
