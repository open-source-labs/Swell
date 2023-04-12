import React from 'react';
import gql from 'graphql-tag';
import { v4 as uuid } from 'uuid';
// Import controllers
import historyController from '../../controllers/historyController';
// Import local components

/**
 * @todo Refactor all of the below components to use MUI, place them in a new
 * "components" folder
 */
import HeaderEntryForm from './new-request/HeaderEntryForm.jsx';
import GraphQLMethodAndEndpointEntryForm from './new-request/GraphQLMethodAndEndpointEntryForm';
import CookieEntryForm from './new-request/CookieEntryForm';
import GraphQLBodyEntryForm from './new-request/GraphQLBodyEntryForm';
import GraphQLVariableEntryForm from './new-request/GraphQLVariableEntryForm';
import GraphQLIntrospectionLog from './new-request/GraphQLIntrospectionLog.jsx';
import NewRequestButton from './new-request/NewRequestButton.jsx';
import TestEntryForm from './new-request/TestEntryForm.jsx';
import TestContainer from '../workspace/TestContainer';

// Import MUI components
import { Box } from '@mui/material';
import { $TSFixMe, ReqRes } from '../../../types';

// Translated from GraphQLContainer.jsx
export default function GraphQLComposer(props: $TSFixMe) {
  const {
    composerFieldsReset,
    fieldsReplaced,
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
    newTestContentSet,
    newRequestBodySet,
    newRequestBody,
    newRequestBody: {
      JSONFormatted,
      rawType,
      bodyContent,
      bodyVariables,
      bodyType,
    },
    newRequestHeadersSet,
    newRequestHeaders,
    newRequestHeaders: { headersArr },
    newRequestCookiesSet,
    newRequestCookies,
    newRequestCookies: { cookiesArr },
    newRequestStreamsSet,
    newRequestStreams,
    newRequestStreams: { protoPath },
    newRequestSSE: { isSSE },
    currentTab,
    introspectionData,
    setWarningMessage,
    warningMessage,
    reqResItemAdded,
    setWorkspaceActiveTab,
  } = props;

  const requestValidationCheck = () => {
    interface ValidationMessage {
      uri?: string;
      json?: string;
      body?: string;
    }
    const validationMessage: ValidationMessage = {};
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
        } catch (err: unknown) {
          const msg =
            err instanceof Error ? err.message : 'Non-error object thrown';

          console.log('error in gql-tag for client', err);
          validationMessage.body = `Invalid graphQL body: \n ${msg}`;
        }
      }
      // need to add validation check for gql variables
    }
    return validationMessage;
  };

  const addNewRequest = () => {
    const warnings = requestValidationCheck();
    if (Object.keys(warnings).length > 0) {
      setWarningMessage(warnings);
      return;
    }

    const protocol: string = url.match(/(https?:\/\/)|(wss?:\/\/)/)[0];
    const URIWithoutProtocol: string = `${url.split(protocol)[1]}/`;
    const host: string = protocol + URIWithoutProtocol.split('/')[0];
    let path: string = `/${URIWithoutProtocol.split('/')
      .splice(1)
      .join('/')
      .replace(/\/{2,}/g, '/')}`;
    if (path.charAt(path.length - 1) === '/' && path.length > 1) {
      path = path.substring(0, path.length - 1);
    }
    path = /wss?:\/\//.test(protocol)
      ? path.replace(/wss?:\//g, 'ws://')
      : path.replace(/https?:\//g, 'http://');
    const reqRes: ReqRes = {
      id: uuid(),
      createdAt: new Date(),
      protocol: /wss?:\/\//.test(protocol)
        ? 'ws://'
        : url.match(/https?:\/\//)[0],
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
        headers: headersArr.filter(
          (header: $TSFixMe) => header.active && !!header.key
        ),
        cookies: cookiesArr.filter(
          (cookie: $TSFixMe) => cookie.active && !!cookie.key
        ),
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
        headers: {},
        events: [],
      },
      checked: false,
      minimized: false,
      tab: currentTab,
    };

    // add request to history
    historyController.addHistoryToIndexedDb(reqRes);
    reqResItemAdded(reqRes);

    //reset for next request
    composerFieldsReset();

    // GRAPHQL REQUESTS

    newRequestBodySet({
      ...newRequestBody,
      bodyType: 'GQL',
      rawType: '',
    });
    fieldsReplaced({
      ...newRequestFields,
      url: gqlUrl,
      gqlUrl,
    });

    setWorkspaceActiveTab('workspace');
  };

  return (
    <Box
      className="is-flex-grow-3 add-vertical-scroll"
      sx={{
        height: '100%',
        px: 1,
        overflowX: 'scroll',
        overflowY: 'scroll',
      }}
      id="composer-graphql"
    >
      <div
        className="add-vertical-scroll container-margin"
        style={{ overflowX: 'hidden' }}
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        // tabIndex={0}
      >
        <GraphQLMethodAndEndpointEntryForm
          fieldsReplaced={fieldsReplaced}
          newRequestBody={newRequestBody}
          newRequestFields={newRequestFields}
          newRequestBodySet={newRequestBodySet}
          warningMessage={warningMessage}
          setWarningMessage={setWarningMessage}
        />
        <HeaderEntryForm
          newRequestHeaders={newRequestHeaders}
          newRequestStreams={newRequestStreams}
          newRequestBody={newRequestBody}
          newRequestFields={newRequestFields}
          newRequestHeadersSet={newRequestHeadersSet}
          newRequestStreamsSet={newRequestStreamsSet}
        />
        <CookieEntryForm
          newRequestCookies={newRequestCookies}
          newRequestBody={newRequestBody}
          newRequestCookiesSet={newRequestCookiesSet}
        />
        <GraphQLBodyEntryForm
          warningMessage={warningMessage}
          newRequestBody={newRequestBody}
          newRequestBodySet={newRequestBodySet}
          introspectionData={introspectionData}
        />
        <GraphQLVariableEntryForm
          newRequestBody={newRequestBody}
          newRequestBodySet={newRequestBodySet}
        />
        <TestContainer />
        <TestEntryForm
          newTestContentSet={newTestContentSet}
          testContent={testContent}
        />
        <GraphQLIntrospectionLog />
      </div>
      <div className="is-3rem-footer is-clickable is-margin-top-auto">
        <NewRequestButton onClick={addNewRequest} />
      </div>
    </Box>
  );
}
