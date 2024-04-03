import React from 'react';
import gql from 'graphql-tag';
import { v4 as uuid } from 'uuid';
// Import controllers
import historyController from '../../../controllers/historyController';
// Import local components

import HeaderEntryForm from '../sharedComponents/requestForms/HeaderEntryForm';
import GraphQLMethodAndEndpointEntryForm from './GraphQLMethodAndEndpointEntryForm';
import CookieEntryForm from '../sharedComponents/requestForms/CookieEntryForm';
import GraphQLBodyEntryForm from './GraphQLBodyEntryForm';
import GraphQLVariableEntryForm from './GraphQLVariableEntryForm';
import GraphQLIntrospectionLog from './GraphQLIntrospectionLog';
import NewRequestButton from '../sharedComponents/requestButtons/NewRequestButton';
import TestEntryForm from '../sharedComponents/requestForms/TestEntryForm';
import TestContainer from '../sharedComponents/stressTest/TestContainer';

// Import MUI components
import { Box } from '@mui/material';
import { $TSFixMe, ReqRes, GraphQlComposerProps, Protocol, ReqResRequest, CookieOrHeader } from '../../../../types';

// Translated from GraphQLContainer.jsx
export default function GraphQLComposer(props: GraphQlComposerProps) {
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
    //the ! asserts here that protocol will not be null for the TS compiler
    //also asserting that the result of match will be of type Protocol
    //this is safe because requestValidationCheck is run above which handles errors if the protocol is invalid
    const protocol: Protocol = url.match(/(https?:\/\/)|(wss?:\/\/)/)![0] as Protocol;
    if(protocol === null) throw new Error('Invalid Protocol');
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
        : url.match(/https?:\/\//)![0] as Protocol, //see above comment where we can see this type assertion is safe
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
      protoPath,
      request: {
        method,
        headers: headersArr.filter(
          (header: CookieOrHeader) => header.active && !!header.key
        ),
        cookies: cookiesArr.filter(
          (cookie: CookieOrHeader) => cookie.active && !!cookie.key
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
          isWebSocket={false}
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
