/**
 * @file This defines the top-level router used for navigating between different
 * tabs in the application.
 *
 * @todo This file uses the old React-Redux connect API. The main component sets
 * up subscriptions to the Redux store for every single state value and dispatch
 * that every child component could ever need, rolls them up into a single
 * props object, and then passes that one object down to every single component.
 *
 * This makes the code harder to maintain, and potentially makes the app's
 * performance worse, because any one of the subscribed values could cause all
 * children to re-render at any time, even if a child doesn't care about the
 * value that changed.
 *
 * The connect API should be removed in favor of moving the state further down
 * to their relevant components, where the subscriptions can be set up with
 * useAppSelector and useAppDispatch.
 */
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import {
  type ReqRes,
  type NewRequestStreams,
  type NewRequestFields,
  type NewRequestBody,
  type RequestWebRTC,
} from '~/types';

import { type ConnectedProps, connect } from 'react-redux';
import { AppDispatch, type RootState } from '~/toolkit/store';
import { reqResItemAdded } from '~/toolkit/slices/reqResSlice';
import {
  NewRequestOpenApi,
  openApiRequestsReplaced,
} from '~/toolkit/slices/newRequestOpenApiSlice';

import {
  type NewRequestState,
  composerFieldsReset,
  newRequestSSESet,
  newRequestCookiesSet,
  newRequestStreamsSet,
  newRequestBodySet,
  newRequestHeadersSet,
} from '~/toolkit/slices/newRequestSlice';

import { setWorkspaceActiveTab } from '~/toolkit/slices/uiSlice';

import {
  fieldsReplaced,
  newTestContentSet,
} from '~/toolkit/slices/newRequestFieldsSlice';

import {
  type WarningMessage,
  setWarningMessage,
} from '~/toolkit/slices/warningMessageSlice';

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

/**@todo Switch to hooks */
const mapStateToProps = (store: RootState) => {
  return {
    currentTab: store.ui.workspaceActiveTab,
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

/**@todo Switch to hooks */
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  reqResItemAdded: (reqRes: ReqRes) => {
    dispatch(reqResItemAdded(reqRes));
  },

  setWarningMessage: (message: WarningMessage) => {
    dispatch(setWarningMessage(message));
  },

  newRequestHeadersSet: (headers: NewRequestState['newRequestHeaders']) => {
    dispatch(newRequestHeadersSet(headers));
  },

  newRequestStreamsSet: (requestStreamsObj: NewRequestStreams) => {
    dispatch(newRequestStreamsSet(requestStreamsObj));
  },

  fieldsReplaced: (requestFields: NewRequestFields) => {
    dispatch(fieldsReplaced(requestFields));
  },

  newRequestBodySet: (requestBodyObj: NewRequestBody) => {
    dispatch(newRequestBodySet(requestBodyObj));
  },

  newTestContentSet: (testContent: NewRequestFields['testContent']) => {
    dispatch(newTestContentSet(testContent));
  },

  newRequestCookiesSet: (
    requestCookiesObj: NewRequestState['newRequestCookies']
  ) => {
    dispatch(newRequestCookiesSet(requestCookiesObj));
  },

  newRequestSSESet: (newValue: boolean) => {
    dispatch(newRequestSSESet(newValue));
  },

  openApiRequestsReplaced: (parsedDocument: NewRequestOpenApi) => {
    dispatch(openApiRequestsReplaced(parsedDocument));
  },

  composerFieldsReset: () => {
    dispatch(composerFieldsReset());
  },

  setWorkspaceActiveTab: (tabName: string) => {
    dispatch(setWorkspaceActiveTab(tabName));
  },
});

const connector = connect(mapStateToProps, mapDispatchToProps);

/**
 * @todo 2023-08-31 - This should be treated as a temporary type (insert quote
 * about how everything long-standing was intended to be temporary).
 *
 * Once all of the Redux values provided via connect has been "tamped down" to
 * their respective components, you can do the following:
 * 1. Delete the ConnectedProps<typeof connector> part from the props
 * 2. Delete connector, mapStateToProps, and mapDispatchToProps, and related
 *    imports
 *
 * Please, PLEASE do not move this type into the global types file. That file
 * needs to get smaller, not bigger.
 *
 * ---
 *
 * @todo part 2 - Because all of these components have been without any true
 * type safety for so long, a lot of props are mismatched or missing. Need to
 * figure out where the missing values should come from
 */
export type ConnectRouterProps = ConnectedProps<typeof connector> & {
  currentWorkspaceId: string;
};

function MainContainer(props: ConnectRouterProps) {
  return (
    <Box sx={{ width: '75%' }}>
      <Split direction="vertical" gutterSize={5} style={{ height: '100%' }}>
        <Box sx={{ display: 'flex' }}>
          <Routes>
            <Route path="/" element={<Http2Composer {...props} />} />
            <Route path="/graphql" element={<GraphQLComposer {...props} />} />
            <Route path="/grpc" element={<GRPCComposer {...props} />} />
            {/* WebRTC has been completely refactored to hooks - no props needed */}
            <Route path="/webrtc" element={<WebRTCComposer />} />
            <Route path="/openapi" element={<OpenAPIComposer {...props} />} />
            <Route path="/webhook" element={<WebhookComposer {...props} />} />
            <Route path="/trpc" element={<TRPCComposer {...props} />} />
            <Route
              path="/websocket"
              element={<WebSocketComposer {...props} />}
            />
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

export default connector(MainContainer);
