import React, { useState, useEffect } from 'react';
// Import controllers.
import connectionController from '../../controllers/reqResController';

// Import Redux actions and methods.
/**@todo delete when slice conversion complete */
import * as actions from '../../features/business/businessSlice';
import * as uiactions from '../../features/ui/uiSlice';

import {
  reqResUpdated,
  reqResItemDeleted,
} from '../../toolkit-refactor/reqRes/reqResSlice';
import {
  newRequestSSESet,
  newRequestCookiesSet,
} from '../../toolkit-refactor/newRequest/newRequestSlice';

import { connect, useSelector, useDispatch } from 'react-redux';
// Import local components.
import DeleteRequestButton from './buttons/DeleteRequestButton';
// Import MUI components.
import { Box } from '@mui/material';
import { TreeItem } from '@mui/lab';

/**@todo switch to hooks? */
const mapStateToProps = (store) => ({
  reqResArray: store.business.reqResArray,
  currentTab: store.business.currentTab,
});

/**@todo switch to hooks? */
const mapDispatchToProps = (dispatch: ReturnType<typeof useDispatch>) => ({
  reqResItemDeleted: (reqRes) => {
    dispatch(reqResItemDeleted(reqRes));
  },
  reqResUpdated: (reqRes) => {
    dispatch(reqResUpdated(reqRes));
  },
});

function RequestCard(props) {
  const dispatch = useDispatch();
  const currentResponse = useSelector(
    // TODO: remove explicit any.
    (store: any) => store.business.currentResponse
  );
  const newRequestFields = useSelector(
    // TODO: remove explicit any.
    (store: any) => store.business.newRequestFields
  );

  const [showDetails, setShowDetails] = useState(false);
  const {
    content,
    //change content for webhook
    content: { protocol, request, connection, connectionType, isHTTP2, url },
    itemDeleted,
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
    dispatch(newRequestCookiesSet(requestCookiesObj));
    dispatch(actions.setNewRequestBody(requestBodyObj));
    dispatch(newRequestSSESet(content.request.isSSE));

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

    dispatch(uiactions.setSidebarActiveTab('composer'));
  };

  const removeReqRes = () => {
    connectionController.closeReqRes(content);
    dispatch(itemDeleted(content));
  };

  return (
    <TreeItem
      key={content.id}
      nodeId={content.id}
      onClick={copyToComposer}
      label={
        <Box>
          {request.method} {url}
          <DeleteRequestButton removeReqRes={removeReqRes} />
        </Box>
      }
    />
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestCard);
