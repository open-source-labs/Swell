import React from 'react';
import uuid from 'uuid/v4';
import gql from 'graphql-tag';
import historyController from '../../controllers/historyController';
import HeaderEntryForm from './NewRequest/HeaderEntryForm.jsx';
import GraphQLMethodAndEndpointEntryForm from './NewRequest/GraphQLMethodAndEndpointEntryForm.jsx';
import CookieEntryForm from './NewRequest/CookieEntryForm.jsx';
import GraphQLBodyEntryForm from './NewRequest/GraphQLBodyEntryForm.jsx';
import GraphQLVariableEntryForm from './NewRequest/GraphQLVariableEntryForm.jsx';
import GraphQLIntrospectionLog from './NewRequest/GraphQLIntrospectionLog.jsx';
import NewRequestButton from './NewRequest/NewRequestButton.jsx';
import TestEntryForm from './NewRequest/TestEntryForm.jsx';

function GraphQLContainer({
  resetComposerFields,
  setNewRequestFields,
  newRequestFields,
  newRequestFields: {
    gRPC,
    webrtc,
    url,
    method,
    graphQL,
    restUrl,
    wsUrl,
    gqlUrl,
    grpcUrl,
    network,
    testContent,
  },
  setNewTestContent,
  setNewRequestBody,
  newRequestBody,
  newRequestBody: {
    JSONFormatted,
    rawType,
    bodyContent,
    bodyVariables,
    bodyType,
  },
  setNewRequestHeaders,
  newRequestHeaders,
  newRequestHeaders: { headersArr },
  setNewRequestCookies,
  newRequestCookies,
  newRequestCookies: { cookiesArr },
  setNewRequestStreams,
  newRequestStreams,
  newRequestStreams: { protoPath },
  newRequestSSE: { isSSE },
  currentTab,
  introspectionData,
  setComposerWarningMessage,
  warningMessage,
  reqResAdd,
  setWorkspaceActiveTab,
}) {
  const requestValidationCheck = () => {
    const validationMessage = {};
    //Error conditions...
    if (/https?:\/\/$|wss?:\/\/$/.test(url)) {
      //if url is only http/https/ws/wss://
      validationMessage.uri = 'Enter a valid URI';
    }
    if (!/(https?:\/\/)|(wss?:\/\/)/.test(url)) {
      //if url doesn't have http/https/ws/wss://
      validationMessage.uri = 'Enter a valid URI';
    }
    if (!JSONFormatted && rawType === 'application/json') {
      validationMessage.json = 'Please fix JSON body formatting errors';
    }
    if (method === 'QUERY') {
      if (url && !bodyContent) {
        validationMessage.body = 'GraphQL Body is Missing';
      }
      if (url && bodyContent) {
        try {
          const body = gql`
            ${bodyContent}
          `;
        } catch (e) {
          console.log('error in gql-tag for client', e);
          validationMessage.body = `Invalid graphQL body: \n ${e.message}`;
        }
      }
      // need to add validation check for gql variables
    }
    return validationMessage;
  };

  const addNewRequest = () => {
    const warnings = requestValidationCheck();
    if (Object.keys(warnings).length > 0) {
      setComposerWarningMessage(warnings);
      return;
    }

    let reqRes;
    const protocol = url.match(/(https?:\/\/)|(wss?:\/\/)/)[0];
    // HTTP && GRAPHQL QUERY & MUTATION REQUESTS
    if (!/wss?:\/\//.test(protocol) && !gRPC) {
      const URIWithoutProtocol = `${url.split(protocol)[1]}/`;
      const host = protocol + URIWithoutProtocol.split('/')[0];
      let path = `/${URIWithoutProtocol.split('/')
        .splice(1)
        .join('/')
        .replace(/\/{2,}/g, '/')}`;
      if (path.charAt(path.length - 1) === '/' && path.length > 1) {
        path = path.substring(0, path.length - 1);
      }
      path = path.replace(/https?:\//g, 'http://');
      reqRes = {
        id: uuid(),
        created_at: new Date(),
        protocol: url.match(/https?:\/\//)[0],
        host,
        path,
        url,
        graphQL,
        gRPC,
        webrtc,
        timeSent: null,
        timeReceived: null,
        connection: 'uninitialized',
        connectionType: null,
        checkSelected: false,
        protoPath,
        request: {
          method,
          headers: headersArr.filter((header) => header.active && !!header.key),
          cookies: cookiesArr.filter((cookie) => cookie.active && !!cookie.key),
          body: bodyContent || '',
          bodyType,
          bodyVariables: bodyVariables || '',
          rawType,
          isSSE,
          network,
          restUrl,
          testContent: testContent || '',
          wsUrl,
          gqlUrl,
          grpcUrl,
        },
        response: {
          headers: null,
          events: null,
        },
        checked: false,
        minimized: false,
        tab: currentTab,
      };
    }
    // GraphQL Subscriptions
    const URIWithoutProtocol = `${url.split(protocol)[1]}/`;
    const host = protocol + URIWithoutProtocol.split('/')[0];
    let path = `/${URIWithoutProtocol.split('/')
      .splice(1)
      .join('/')
      .replace(/\/{2,}/g, '/')}`;
    if (path.charAt(path.length - 1) === '/' && path.length > 1) {
      path = path.substring(0, path.length - 1);
    }
    path = path.replace(/wss?:\//g, 'ws://');
    reqRes = {
      id: uuid(),
      created_at: new Date(),
      protocol: 'ws://',
      host,
      path,
      url,
      graphQL,
      gRPC,
      timeSent: null,
      timeReceived: null,
      connection: 'uninitialized',
      connectionType: null,
      checkSelected: false,
      request: {
        method,
        headers: headersArr.filter((header) => header.active && !!header.key),
        cookies: cookiesArr.filter((cookie) => cookie.active && !!cookie.key),
        body: bodyContent || '',
        bodyType,
        bodyVariables: bodyVariables || '',
        rawType,
        network,
        restUrl,
        testContent: testContent || '',
        wsUrl,
        gqlUrl,
        grpcUrl,
      },
      response: {
        headers: null,
        events: null,
      },
      checked: false,
      minimized: false,
      tab: currentTab,
    };

    // add request to history
    historyController.addHistoryToIndexedDb(reqRes);
    reqResAdd(reqRes);

    //reset for next request
    resetComposerFields();

    // GRAPHQL REQUESTS

    setNewRequestBody({
      ...newRequestBody,
      bodyType: 'GQL',
      rawType: '',
    });
    setNewRequestFields({
      ...newRequestFields,
      url: gqlUrl,
      gqlUrl,
    });

    setWorkspaceActiveTab('workspace');
  };

  return (
    <div className="is-flex is-flex-direction-column is-justify-content-space-between is-tall">
      <div
        className="is-flex-grow-3 add-vertical-scroll"
        style={{ overflowX: 'hidden' }}
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        // tabIndex={0}
      >
        <GraphQLMethodAndEndpointEntryForm
          newRequestFields={newRequestFields}
          newRequestHeaders={newRequestHeaders}
          newRequestStreams={newRequestStreams}
          newRequestBody={newRequestBody}
          setNewRequestFields={setNewRequestFields}
          setNewRequestHeaders={setNewRequestHeaders}
          setNewRequestStreams={setNewRequestStreams}
          setNewRequestCookies={setNewRequestCookies}
          setNewRequestBody={setNewRequestBody}
          warningMessage={warningMessage}
          setComposerWarningMessage={setComposerWarningMessage}
          setNewTestContent={setNewTestContent}
        />
        <HeaderEntryForm
          newRequestHeaders={newRequestHeaders}
          newRequestStreams={newRequestStreams}
          newRequestBody={newRequestBody}
          newRequestFields={newRequestFields}
          setNewRequestHeaders={setNewRequestHeaders}
          setNewRequestStreams={setNewRequestStreams}
        />
        <CookieEntryForm
          newRequestCookies={newRequestCookies}
          newRequestBody={newRequestBody}
          setNewRequestCookies={setNewRequestCookies}
        />
        <GraphQLBodyEntryForm
          warningMessage={warningMessage}
          newRequestBody={newRequestBody}
          setNewRequestBody={setNewRequestBody}
          introspectionData={introspectionData}
        />
        <GraphQLVariableEntryForm
          newRequestBody={newRequestBody}
          setNewRequestBody={setNewRequestBody}
        />
        <TestEntryForm
          setNewTestContent={setNewTestContent}
          testContent={testContent}
        />
        <GraphQLIntrospectionLog />
      </div>
      <div className="is-3rem-footer is-clickable is-margin-top-auto">
        <NewRequestButton onClick={addNewRequest} />
      </div>
    </div>
  );
}

export default GraphQLContainer;
