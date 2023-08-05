/** Also not legacy */

import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import connectionController from '../../controllers/reqResController';
import testSDPConnection from '../../controllers/webrtcPeerController';
import { responseDataSaved } from '../../toolkit-refactor/slices/reqResSlice';
// import { fieldsReplaced } from '../../toolkit-refactor/slices/newRequestFieldsSlice';
// import {
//   newRequestSSESet,
//   newRequestCookiesSet,
//   newRequestStreamsSet,
//   newRequestBodySet,
//   newRequestHeadersSet,
// } from '../../toolkit-refactor/slices/newRequestSlice';
import {
  setResponsePaneActiveTab,
  setSidebarActiveTab,
} from '../../toolkit-refactor/slices/uiSlice';

import { useAppDispatch } from '../../toolkit-refactor/store';
const WorkspaceCollectionElement = (props) => {
  const [showDetails, setShowDetails] = useState(false);
  const dispatch = useAppDispatch();

  const currentResponse = useSelector((store) => store.reqRes.currentResponse);
  const newRequestFields = useSelector((store) => store.newRequestFields);

  const {
    content,
    //change content for webhook
    content: { protocol, request, connection, connectionType, isHTTP2, url },
    reqResItemDeleted,
    index,
  } = props;
  const network = content.request.network;
  const method = content.request.method;

  const removeReqRes = () => {
    connectionController.closeReqRes(content);
    reqResItemDeleted(content);
  };

  // changes the color of boarder depending on the response?
  const getBorderClass = () => {
    let classes = 'highlighted-response ';
    if (currentResponse.gRPC) classes += 'is-grpc-border';
    else if (currentResponse.graphQL) classes += 'is-graphQL-border';
    else if (currentResponse.request.method === 'WS') classes += 'is-ws-border';
    else if (currentResponse.webrtc) classes += 'is-webrtc-border';
    else classes += 'is-rest-border';
    return classes;
  };

  const highlightClasses =
    currentResponse.id === content.id ? getBorderClass(currentResponse) : '';

  return (
    <div className={`m-3 ${highlightClasses}`}>
      {/* TITLE BAR */}
      <div className="is-flex cards-titlebar">
        <div
          className={`is-flex-grow-1 is-${network} is-flex-basis-0 is-flex is-justify-content-center is-align-items-center has-text-weight-medium`}
        >
          {request.method}
        </div>
        <div className="is-flex-grow-2 is-size-7 is-flex-basis-0 is-flex is-align-items-center is-justify-content-space-between">
          <div className="is-flex is-align-items-center ml-2">{url}</div>
          {/* RENDER STATUS */}
          <div className="req-status mr-1 is-flex is-align-items-center">
            {connection === 'uninitialized' && (
              <div className="connection-uninitialized" />
            )}
            {connection === 'error' && <div className="connection-error" />}
            {connection === 'open' && <div className="connection-open" />}
            {connection === 'closed' &&
              method !== 'WS' &&
              method !== 'SUBSCRIPTION' && (
                <div className="connection-closed" />
              )}
            {connection === 'closed' &&
              (method === 'WS' || method === 'SUBSCRIPTION') && (
                <div className="connection-closedsocket" />
              )}
          </div>
        </div>
      </div>
      {/* VIEW REQUEST DETAILS / MINIMIZE
        - copyToComposer is not defined
        - commenting out Click functionality because everything connected to this is broken
      */}
      {network !== 'ws' && (
        <div
          className="is-neutral-300 is-size-7 cards-dropdown minimize-card pl-3 is-flex is-align-items-center is-justify-content-space-between"
          // onClick={() => {
          //   setShowDetails(showDetails === false);
          // }}
        >
          {showDetails === true && 'Hide Request Details'}
          {showDetails === false && 'View Request Details'}
          {network !== 'openapi' && showDetails === true && (
            <div
              className="is-clickable is-primary-link mr-3"
              onClick={copyToComposer}
            >
              Copy to Composer
            </div>
          )}
        </div>
      )}
      {/* REQUEST ELEMENTS 
          - none of the Request Elements are defined ex.  <RestRequestContent /> <GraphQLRequestContent /> so this will crash the app
          - because the onClick for VIEW REQUEST DETAILS is currently disabled, this code will not be reached */}
      {showDetails === true && (
        <div className="is-neutral-200-box">
          {network === 'rest' && (
            <RestRequestContent request={content.request} isHTTP2={isHTTP2} />
          )}
          {network === 'openapi' && (
            <OpenAPIRequestContent
              request={content.request}
              isHTTP2={isHTTP2}
            />
          )}
          {network === 'grpc' && (
            <GRPCRequestContent
              request={content.request}
              rpc={content.rpc}
              service={content.service}
            />
          )}
          {network === 'graphQL' && (
            <GraphQLRequestContent request={content.request} />
          )}
 
          {network === 'webrtc' && <WebRTCRequestContent content={content} />}
        </div>
      )}
      {/* REMOVE / SEND BUTTONS */}
      <div className="is-flex">
        <button
          className="is-flex-basis-0 is-flex-grow-1 button is-neutral-100 is-size-7 border-curve"
          id={request.method.split(' ').join('-')}
          onClick={() => {
            removeReqRes();
            dispatch(responseDataSaved({}));
          }}
        >
          Remove
        </button>
        {/* SEND BUTTON */}
        {connection === 'uninitialized' && (
          <button
            className="is-flex-basis-0 is-flex-grow-1 button is-primary-100 is-size-7 border-curve"
            id={`send-button-${index}`}
            onClick={() => {
              if (network === 'webrtc') {
                testSDPConnection(content);
              } else if (content.graphQL && request.method === 'SUBSCRIPTION') {
                // For GraphQL subscriptions, `GraphQLController::openSubscription` will take care of
                // updating state, and we do not want to overwrite response data here
                connectionController.openReqRes(content.id);
              } else {
                dispatch(
                  setResponsePaneActiveTab(
                    connectionType === 'WebSocket' ? 'wsWindow' : 'events'
                  )
                );
                connectionController.openReqRes(content.id);
                // Dispatch will fire first before the callback of
                // [ipcMain.on('open-ws'] is fired.
                // Check async and callback queue concepts
                dispatch(responseDataSaved(content));
              }
            }}
          >
            Send
          </button>
        )}
        {/* VIEW RESPONSE BUTTON */}
        {connection !== 'uninitialized' && (
          <button
            className="is-flex-basis-0 is-flex-grow-1 button is-neutral-50 is-size-7 border-curve"
            id={`view-button-${index}`}
            onClick={() => {
              dispatch(responseDataSaved(content));
            }}
          >
            View Response
          </button>
        )}
      </div>
    </div>
  );
};
export default WorkspaceCollectionElement;
