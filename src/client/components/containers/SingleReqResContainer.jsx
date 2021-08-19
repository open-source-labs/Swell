/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../../actions/actions.js';
import connectionController from '../../controllers/reqResController';
import RestRequestContent from '../display/RestRequestContent.jsx';
import GraphQLRequestContent from '../display/GraphQLRequestContent.jsx';
import WebRTCRequestContent from '../display/WebRTCRequestContent.jsx';
import GRPCRequestContent from '../display/GRPCRequestContent.jsx';
import OpenAPIRequestContent from '../display/OpenAPIRequestContent.jsx';

const SingleReqResContainer = (props) => {
  const [showDetails, setShowDetails] = useState(false);
  const dispatch = useDispatch();

  const currentResponse = useSelector(
    (store) => store.business.currentResponse
  );

  const newRequestFields = useSelector(
    (store) => store.business.newRequestFields
  );

  const {
    content,
    content: { protocol, request, connection, connectionType, isHTTP2, url },

    reqResDelete,
    index,
  } = props;
  const network = content.request.network;
  const method = content.request.method;

  useEffect(() => {
    if (content.request.network === 'webrtc') {
      setShowDetails(true);
    }
  }, [content.request.network]);

  const copyToComposer = () => {
    let requestFieldObj = {};

    if (network === 'rest') {
      requestFieldObj = {
        ...newRequestFields,
        method: content.request.method || 'GET',
        protocol: content.protocol || 'http://',
        url: content.url,
        restUrl: content.request.restUrl,
        graphQL: content.graphQL || false,
        gRPC: content.gRPC || false,
        webrtc: content.webrtc || false,
        network,
        testContent: content.request.testContent,
      };
    }

    if (network === 'ws') {
      requestFieldObj = {
        ...newRequestFields,
        method: content.request.method || 'GET',
        protocol: content.protocol || 'http://',
        url: content.url,
        wsUrl: content.request.wsUrl,
        graphQL: content.graphQL || false,
        gRPC: content.gRPC || false,
        network,
      };
    }

    if (network === 'webrtc') {
      requestFieldObj = {
        ...newRequestFields,
        method: content.request.method || 'GET',
        protocol: content.protocol || 'http://',
        url: content.url,
        wsUrl: content.request.wsUrl,
        graphQL: content.graphQL || false,
        gRPC: content.gRPC || false,
        network,
        webrtcData: content.webrtcData,
      };
    }

    if (network === 'graphQL') {
      requestFieldObj = {
        ...newRequestFields,
        method: content.request.method || 'GET',
        protocol: content.protocol || 'http://',
        url: content.url,
        gqlUrl: content.request.gqlUrl,
        graphQL: content.graphQL || false,
        gRPC: content.gRPC || false,
        network,
        testContent: content.request.testContent,
      };
    }

    if (network === 'grpc') {
      requestFieldObj = {
        ...newRequestFields,
        method: content.request.method || 'GET',
        protocol: content.protocol || 'http://',
        url: content.url,
        grpcUrl: content.request.grpcUrl,
        graphQL: content.graphQL || false,
        gRPC: content.gRPC || false,
        network,
        testContent: content.request.testContent,
      };
    }

    let headerDeeperCopy;

    if (content.request.headers) {
      headerDeeperCopy = JSON.parse(JSON.stringify(content.request.headers));
      headerDeeperCopy.push({
        id: content.request.headers.length + 1,
        active: false,
        key: '',
        value: '',
      });
    }

    let cookieDeeperCopy;

    if (content.request.cookies && !/ws/.test(protocol)) {
      cookieDeeperCopy = JSON.parse(JSON.stringify(content.request.cookies));
      cookieDeeperCopy.push({
        id: content.request.cookies.length + 1,
        active: false,
        key: '',
        value: '',
      });
    }

    const requestHeadersObj = {
      headersArr: headerDeeperCopy || [],
      count: headerDeeperCopy ? headerDeeperCopy.length : 1,
    };

    const requestCookiesObj = {
      cookiesArr: cookieDeeperCopy || [],
      count: cookieDeeperCopy ? cookieDeeperCopy.length : 1,
    };

    const requestBodyObj = {
      webrtcData: content.webrtcData,
      bodyType: content.request.bodyType || 'raw',
      bodyContent: content.request.body || '',
      bodyVariables: content.request.bodyVariables || '',
      rawType: content.request.rawType || 'Text (text/plain)',
      JSONFormatted: true,
      bodyIsNew: false,
    };

    dispatch(actions.setNewRequestFields(requestFieldObj));
    dispatch(actions.setNewRequestHeaders(requestHeadersObj));
    dispatch(actions.setNewRequestCookies(requestCookiesObj));
    dispatch(actions.setNewRequestBody(requestBodyObj));
    dispatch(actions.setNewRequestSSE(content.request.isSSE));

    if (content && content.gRPC) {
      const streamsDeepCopy = JSON.parse(JSON.stringify(content.streamsArr));
      const contentsDeepCopy = JSON.parse(
        JSON.stringify(content.streamContent)
      );

      // construct the streams obj from passed in history content & set state in store
      const requestStreamsObj = {
        streamsArr: streamsDeepCopy,
        count: content.queryArr.length,
        streamContent: contentsDeepCopy,
        selectedPackage: content.packageName,
        selectedRequest: content.rpc,
        selectedService: content.service,
        selectedStreamingType: content.request.method,
        initialQuery: content.initialQuery,
        queryArr: content.queryArr,
        protoPath: content.protoPath,
        services: content.servicesObj,
        protoContent: content.protoContent,
      };

      dispatch(actions.setNewRequestStreams(requestStreamsObj));
    }

    dispatch(actions.setSidebarActiveTab('composer'));
  };

  const removeReqRes = () => {
    connectionController.closeReqRes(content);
    reqResDelete(content);
  };

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
      {/* VIEW REQUEST DETAILS / MINIMIZE */}
      {network !== 'ws' && (
        <div
          className="is-neutral-300 is-size-7 cards-dropdown minimize-card pl-3 is-flex is-align-items-center is-justify-content-space-between"
          onClick={() => {
            setShowDetails(showDetails === false);
          }}
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
      {/* REQUEST ELEMENTS */}
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
          className="is-flex-basis-0 is-flex-grow-1 button is-neutral-100 is-size-7 bl-border-curve"
          id={request.method.split(' ').join('-')}
          onClick={() => {
            removeReqRes();
            dispatch(actions.saveCurrentResponseData({}));
          }}
        >
          Remove
        </button>
        {/* SEND BUTTON */}
        {connection === 'uninitialized' && (
          <button
            className="is-flex-basis-0 is-flex-grow-1 button is-primary-100 is-size-7 br-border-curve"
            id={`send-button-${index}`}
            disabled={network === 'webrtc'}
            onClick={() => {
              //check the request type
              //if it's http, dispatch set active tab to "event" for reqResResponse
              //otherwise do nothing
              if (connectionType !== 'WebSocket') {
                dispatch(actions.setResponsePaneActiveTab('events'));
              }
              connectionController.openReqRes(content.id);
              dispatch(
                actions.saveCurrentResponseData(
                  content,
                  'singleReqResContainercomponentSendHandler'
                )
              ); //dispatch will fire first before the callback of [ipcMain.on('open-ws'] is fired. check async and callback queue concepts
            }}
          >
            Send
          </button>
        )}
        {/* VIEW RESPONSE BUTTON */}
        {connection !== 'uninitialized' && (
          <button
            className="is-flex-basis-0 is-flex-grow-1 button is-neutral-100 is-size-7 br-border-curve"
            id={`view-button-${index}`}
            onClick={() => {
              dispatch(actions.saveCurrentResponseData(content));
            }}
          >
            View Response
          </button>
        )}
      </div>
    </div>
  );
};
export default SingleReqResContainer;
