import React from 'react';
import { Link } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import { RootState } from '../../toolkit-refactor/store';

// Import actions so that the navbar can interact with the Redux store.
import * as ReqResSlice from '../../toolkit-refactor/reqRes/reqResSlice';
import {
  composerFieldsReset,
  newRequestSSESet,
  newRequestCookiesSet,
  newRequestStreamsSet,
  newRequestBodySet,
  newRequestHeadersSet,
} from '../../toolkit-refactor/newRequest/newRequestSlice';
import { openApiRequestsReplaced } from '../../toolkit-refactor/newRequestOpenApi/newRequestOpenApiSlice';

import { setWorkspaceActiveTab } from '../../toolkit-refactor/ui/uiSlice';
import {
  fieldsReplaced,
  newTestContentSet,
} from '../../toolkit-refactor/newRequestFields/newRequestFieldsSlice';
import { setWarningMessage } from '../../toolkit-refactor/warningMessage/warningMessageSlice';

// Import MUI components.
import { styled } from '@mui/system';
import { Box, Button } from '@mui/material';
import ButtonUnstyled, {
  buttonUnstyledClasses,
} from '@mui/base/ButtonUnstyled';

const blue = {
  500: '#51819b',
  600: '#95ceed',
  700: '#7ebdde',
};

const white = {
  500: '#f0f6fa',
};

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
    box-shadow: 0 4px 20px 0 rgba(61, 71, 82, 0.1),
      0 0 0 5px rgba(0, 127, 255, 0.5);
    outline: none;
  }

  &.${buttonUnstyledClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/**@todo switch to hooks? */
const mapStateToProps = (store: RootState) => {
  return {
    reqResArray: store.reqRes.reqResArray,
    newRequestFields: store.newRequestFields,
    newRequestHeaders: store.newRequest.newRequestHeaders,
    newRequestStreams: store.newRequest.newRequestStreams,
    newRequestBody: store.newRequest.newRequestBody,
    newRequestsOpenAPI: store.newRequestOpenApi,
    newRequestCookies: store.newRequest.newRequestCookies,
    newRequestSSE: store.newRequest.newRequestSSE,
    warningMessage: store.warningMessage,
    introspectionData: store.introspectionData,
  };
};

/**@todo switch to hooks? */
const mapDispatchToProps = (dispatch) => ({
  reqResItemAdded: (reqRes) => {
    dispatch(ReqResSlice.reqResItemAdded(reqRes));
  },
  setWarningMessage: (message) => {
    dispatch(setWarningMessage(message));
  },
  newRequestHeadersSet: (requestHeadersObj) => {
    dispatch(newRequestHeadersSet(requestHeadersObj));
  },
  newRequestStreamsSet: (requestStreamsObj) => {
    dispatch(newRequestStreamsSet(requestStreamsObj));
  },
  fieldsReplaced: (requestFields) => {
    dispatch(fieldsReplaced(requestFields));
  },
  newRequestBodySet: (requestBodyObj) => {
    dispatch(newRequestBodySet(requestBodyObj));
  },
  newTestContentSet: (testContent) => {
    dispatch(newTestContentSet(testContent));
  },
  newRequestCookiesSet: (requestCookiesObj) => {
    dispatch(newRequestCookiesSet(requestCookiesObj));
  },
  newRequestSSESet: (requestSSEBool) => {
    dispatch(newRequestSSESet(requestSSEBool));
  },
  openApiRequestsReplaced: (parsedDocument) => {
    dispatch(openApiRequestsReplaced(parsedDocument));
  },
  composerFieldsReset: () => {
    dispatch(composerFieldsReset());
  },
  setWorkspaceActiveTab: (tabName) => {
    dispatch(setWorkspaceActiveTab(tabName));
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
  { name: 'tRPC', route: '/trpc', value: 'tRPC'},
];

/**
 * ProtocolSelect is a component in the navbar that alters the redux store based on the protocol that is selected.
 * It is responsible for kicking off the process of creating default values for the composer containers.
 * Click a protocol button -> Alter the Redux store accordingly -> Route to the appropriate "main" container
 */
/**@todo - refactor below function to be more DRY */
function ProtocolSelect(props) {
  /**
   * Alters the Redux store when a protocol is selected.
   * @param network
   */
  const onProtocolSelect = (network) => {
    if (props.warningMessage.uri) {
      const warningMessage = { ...props.warningMessage };
      delete warningMessage.uri;
      props.setWarningMessage({ ...warningMessage });
    }
    props.setWarningMessage({});
    switch (network) {
      /**
       * @TODO add tRPC state management
       */ 
      // case 'tRPC': {
      //   break;
      // }

      
      case 'graphQL': {
        props.composerFieldsReset();
        props.fieldsReplaced({
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
        props.newRequestBodySet({
          ...props.newRequestBody,
          bodyType: 'GQL',
          bodyVariables: '',
        });
        break;
      }
      case 'rest': {
        props.composerFieldsReset();
        props.fieldsReplaced({
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
        props.newRequestBodySet({
          ...props.newRequestBody,
          bodyType: 'none',
          bodyContent: ``,
        });
        break;
      }
      case 'openapi': {
        props.composerFieldsReset();
        props.fieldsReplaced({
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
        props.newRequestBodySet({
          ...props.newRequestBody,
          bodyType: 'none',
          bodyContent: '',
        });
        break;
      }
      case 'grpc': {
        props.composerFieldsReset();
        props.fieldsReplaced({
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
        props.newRequestBodySet({
          ...props.newRequestBody,
          bodyType: 'GRPC',
          bodyContent: ``,
        });
        break;
      }
      case 'ws': {
        props.composerFieldsReset();
        props.fieldsReplaced({
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
        props.newRequestBodySet({
          ...props.newRequestBody,
          bodyType: 'none',
          bodyContent: '',
        });
        break;
      }
      case 'webrtc': {
        props.composerFieldsReset();
        props.fieldsReplaced({
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
        props.newRequestBodySet({
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
        props.composerFieldsReset();
        props.fieldsReplaced({
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
        props.newRequestBodySet({
          ...props.newRequestBody,
          bodyType: 'none',
        });
        break;
      }
      default:
    }
  };

  return (
    <Box
      key="page-selector"
      sx={{
        flexGrow: 1,
        display: { xs: 'none', md: 'flex' },
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {pages.map((page) => (
        <Link key={page.name} to={page.route}>
          <CustomButton
            key={page.name}
            // variant="contained"
            // color="primary"
            onClick={() => {
              console.log(page.value);
              onProtocolSelect(page.value);
            }}
            sx={{
              m: 1,
            }}
          >
            {page.name}
          </CustomButton>
        </Link>
      ))}
    </Box>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(ProtocolSelect);
