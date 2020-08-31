/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import historyController from '../../controllers/historyController';

const History = ({ newRequestFields, content, content: { request : { method, 
  headers, cookies, bodyType, body, bodyVariables, rawType, JSONFormatted, network, 
  restUrl, wsUrl, gqlUrl, grpcUrl }, protocol, url, graphQL, gRPC, streamsArr, 
  streamContent, queryArr, packageName, rpc, service, initialQuery, protoPath, 
  servicesObj, protoContent }, setNewRequestFields, setNewRequestHeaders, setNewRequestCookies, 
  setNewRequestBody, setNewRequestStreams, deleteFromHistory, focusOnForm }) => {

  const addHistoryToNewRequest = () => {
    let requestFieldObj = {};
    if (network === 'rest') {
      requestFieldObj = {
        ...newRequestFields,
        method: method || 'GET',
        protocol: protocol || 'http://',
        url,
        restUrl,
        graphQL: graphQL || false,
        gRPC: gRPC || false,
        network,
      }
    };
    if (network === 'ws') {
      requestFieldObj = {
        ...newRequestFields,
        method: method || 'GET',
        protocol: protocol || 'http://',
        url,
        wsUrl,
        graphQL: graphQL || false,
        gRPC: gRPC || false,
        network,
      }
    };
    if (network === 'graphQL') {
      requestFieldObj = {
        ...newRequestFields,
        method: method || 'GET',
        protocol: protocol || 'http://',
        url,
        gqlUrl,
        graphQL: graphQL || false,
        gRPC: gRPC || false,
        network,
      }
    };
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
      }
    };
    let headerDeeperCopy;
    if (headers) {
      headerDeeperCopy = JSON.parse(JSON.stringify(headers));
      headerDeeperCopy.push({
        id: headers.length + 1,
        active: false,
        key: '',
        value: '',
      })
    }
    let cookieDeeperCopy;
    if (cookies && !/ws/.test(protocol)) {
      cookieDeeperCopy = JSON.parse(JSON.stringify(cookies));
      cookieDeeperCopy.push({
        id: cookies.length + 1,
        active: false,
        key: '',
        value: '',
      })
    }
    const requestHeadersObj = {
      headersArr: headerDeeperCopy || [],
      count: headerDeeperCopy ? headerDeeperCopy.length : 1,
    }
    const requestCookiesObj = {
      cookiesArr: cookieDeeperCopy || [],
      count: cookieDeeperCopy ? cookieDeeperCopy.length : 1,
    }
    const requestBodyObj = {
      bodyType: bodyType || 'raw',
      bodyContent: body || '',
      bodyVariables: bodyVariables || '',
      rawType: rawType || 'Text (text/plain)',
      JSONFormatted: JSONFormatted || true,
      bodyIsNew: false,
    }
    setNewRequestFields(requestFieldObj);
    setNewRequestHeaders(requestHeadersObj);
    setNewRequestCookies(requestCookiesObj);
    setNewRequestBody(requestBodyObj);
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
        selectedService:  service,
        selectedStreamingType: method,
        initialQuery,
        queryArr,
        protoPath,
        services: servicesObj,
        protoContent,
      }
      setNewRequestStreams(requestStreamsObj)

      // grab the dropdown lists and set its selected value to equal what is in the history
      const dropdownService = document.getElementById('dropdownService').options;
      for (const option of dropdownService) {
        if (option.text === service) {
          option.selected = true;
        }
      }
      const dropdownRequest = document.getElementById('dropdownRequest').options;
      for (const option of dropdownRequest) {
        if (option.text === rpc) {
          option.selected = true;
        }
      }
      // update streaming type button displayed next to the URL
      document.getElementById('stream').innerText = method;
    }
  }

  const deleteHistory = (e) => {
    deleteFromHistory(content);
    historyController.deleteHistoryFromIndexedDb(e.target.id);
  }

    return (
      <div className="history-container" onClick={() => focusOnForm()} >
        <div className="history-text-container" onClick={() => addHistoryToNewRequest()}>
          <div className="history-method"> {method} </div>
          <div className="history-url"> {url} </div>
        </div>
        <div className='history-delete-container'>
          <div className="history-delete-button" onClick={(e) => deleteHistory(e)} id={content.id}>
            X
          </div>
        </div>
      </div>
    )
}

export default History;