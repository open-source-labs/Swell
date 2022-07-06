/* eslint-disable default-case */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { useDispatch } from 'react-redux';
import { historyDeleted } from '../../toolkit-refactor/history/historySlice';
import { setSidebarActiveTab } from '../../toolkit-refactor/ui/uiSlice';

import { newRequestSSESet } from '../../toolkit-refactor/newRequest/newRequestSlice';

import historyController from '../../controllers/historyController';

const History = ({
  newRequestFields,
  newRequestsOpenAPI,
  content,
  content: {
    request: {
      method,
      isSSE,
      headers,
      cookies,
      bodyType,
      body,
      bodyVariables,
      rawType,
      JSONFormatted,
      network,
      restUrl,
      wsUrl,
      gqlUrl,
      grpcUrl,
    },
    protocol,
    url,
    webrtcUrl,
    graphQL,
    gRPC,
    webrtc,
    streamsArr,
    streamContent,
    queryArr,
    packageName,
    rpc,
    service,
    initialQuery,
    protoPath,
    servicesObj,
    protoContent,
  },
  fieldsReplaced,
  newRequestHeadersSet,
  newRequestCookiesSet,
  newRequestBodySet,
  newRequestStreamsSet,
}) => {
  const dispatch = useDispatch();
  const setSidebarTab = (tabName) => dispatch(setSidebarActiveTab(tabName));
  const setNewRequestSSE = (bool) => dispatch(newRequestSSESet(bool));

  const addHistoryToNewRequest = () => {
    let requestFieldObj = {};
    if (network === 'rest') {
      requestFieldObj = {
        ...newRequestFields,
        isSSE: isSSE || false,
        method: method || 'GET',
        protocol: protocol || 'http://',
        url,
        restUrl,
        graphQL: graphQL || false,
        gRPC: gRPC || false,
        webrtc: webrtc || false,
        network,
        testContent: content.request.testContent,
      };
    }
    if (network === 'openapi') {
      requestFieldObj = {
        ...newRequestFields,
        ...newRequestsOpenAPI,
        isSSE: isSSE || false,
        method: method || 'GET',
        protocol: protocol || 'http://',
        url,
        restUrl,
        graphQL: graphQL || false,
        gRPC: gRPC || false,
        webrtc: webrtc || false,
        network,
      };
    }
    if (network === 'ws') {
      requestFieldObj = {
        ...newRequestFields,
        method: method || 'GET',
        protocol: protocol || 'http://',
        url,
        wsUrl,
        graphQL: graphQL || false,
        gRPC: gRPC || false,
        webrtc: webrtc || false,
        network,
      };
    }
    if (network === 'graphQL') {
      requestFieldObj = {
        ...newRequestFields,
        method: method || 'GET',
        protocol: protocol || 'http://',
        url,
        gqlUrl,
        graphQL: graphQL || false,
        gRPC: gRPC || false,
        webrtc: webrtc || false,
        network,
      };
    }
    if (network === 'webrtc') {
      requestFieldObj = {
        ...newRequestFields,
        method: method || 'GET',
        protocol: protocol || 'http://',
        url,
        webrtcUrl,
        grpcUrl,
        graphQL: graphQL || false,
        gRPC: gRPC || false,
        webrtc: webrtc || false,
        network,
      };
    }
    if (network === 'grpc') {
      requestFieldObj = {
        ...newRequestFields,
        method: method || 'GET',
        protocol: protocol || 'http://',
        url,
        grpcUrl,
        graphQL: graphQL || false,
        gRPC: gRPC || false,
        network,
      };
    }
    let headerDeeperCopy;
    if (headers) {
      headerDeeperCopy = JSON.parse(JSON.stringify(headers));
      headerDeeperCopy.push({
        id: headers.length + 1,
        active: false,
        key: '',
        value: '',
      });
    }
    let cookieDeeperCopy;
    if (cookies && !/ws/.test(protocol)) {
      cookieDeeperCopy = JSON.parse(JSON.stringify(cookies));
      cookieDeeperCopy.push({
        id: cookies.length + 1,
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
      bodyType: bodyType || 'raw',
      bodyContent: body || '',
      bodyVariables: bodyVariables || '',
      rawType: rawType || 'text/plain',
      JSONFormatted: JSONFormatted || true,
      bodyIsNew: false,
    };
    fieldsReplaced(requestFieldObj);
    newRequestHeadersSet(requestHeadersObj);
    newRequestCookiesSet(requestCookiesObj);
    newRequestBodySet(requestBodyObj);
    setNewRequestSSE(isSSE);
    // for gRPC
    if (content && gRPC) {
      const streamsDeepCopy = JSON.parse(JSON.stringify(streamsArr));
      const contentsDeepCopy = JSON.parse(JSON.stringify(streamContent));
      // construct the streams obj from passed in history content & set state in store
      const requestStreamsObj = {
        streamsArr: streamsDeepCopy,
        count: queryArr.length,
        streamContent: contentsDeepCopy,
        selectedPackage: packageName,
        selectedRequest: rpc,
        selectedService: service,
        selectedStreamingType: method,
        initialQuery,
        queryArr,
        protoPath,
        services: servicesObj,
        protoContent,
      };
      newRequestStreamsSet(requestStreamsObj);
    }
    setSidebarTab('composer');
  };

  let colorClass;
  switch (network) {
    case 'grpc':
      colorClass = 'is-grpc-color';
      break;
    case 'rest':
      colorClass = 'is-rest-color';
      break;
    case 'graphQL':
      colorClass = 'is-graphQL-color';
      break;
    case 'ws':
      colorClass = 'is-ws-color';
      break;
    case 'openapi':
      colorClass = 'is-openapi-color';
      break;
    case 'webrtc':
      colorClass = 'is-webrtc-color';
      break;
  }

  const deleteHistory = (event) => {
    dispatch(historyDeleted(content));
    historyController.deleteHistoryFromIndexedDb(event.target.id);
  };

  const urlDisplay = url && url.length > 32 ? url.slice(0, 32) + '...' : url;

  return (
    <div className="history-container is-flex is-justify-content-space-between m-3">
      <div
        className="is-clickable is-primary-link is-flex"
        onClick={() => addHistoryToNewRequest()}
      >
        <div className={`history-method mr-2 ${colorClass}`}> {method} </div>
        <div className="history-url"> {urlDisplay || '-'} </div>
      </div>
      <div className="history-delete-container">
        <div
          className="history-delete-button delete"
          onClick={(e) => deleteHistory(e)}
          id={content.id}
        />
      </div>
    </div>
  );
};

export default History;
