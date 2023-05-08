import React from 'react';
import { v4 as uuid } from 'uuid';
// Import controllers
import historyController from '../../../controllers/historyController';
// Import local components

import NewRequestButton from '../sharedComponents/requestButtons/NewRequestButton';
import OpenAPIEntryForm from './OpenAPIEntryForm';
import OpenAPIDocumentEntryForm from './OpenAPIDocumentEntryForm.jsx';
import OpenAPIMetadata from './OpenAPIMetadata.jsx';
import OpenAPIServerForm from './OpenAPIServerForm.jsx';
// Import MUI components
import { Box } from '@mui/material';
import { $TSFixMe, ReqRes } from '../../../../types.js';

export default function OpenAPIComposer(props: $TSFixMe) {
  const {
    composerFieldsReset,
    openApiRequestsReplaced,
    newRequestsOpenAPI,
    fieldsReplaced,
    newRequestFields,
    newRequestFields: {
      gRPC,
      webrtc,
      graphQL,
      restUrl,
      wsUrl,
      gqlUrl,
      grpcUrl,
      network,
      testContent,
    },
    newRequestBodySet,
    newRequestBody,
    newRequestBody: { rawType, bodyType },
    newRequestHeadersSet,
    newRequestHeaders,
    newRequestHeaders: { headersArr },
    newRequestCookiesSet,
    currentTab,
    setWarningMessage,
    warningMessage,
    reqResItemAdded,
    setWorkspaceActiveTab,
  } = props;

  const requestValidationCheck = () => {
    const validationMessage = {};
    //Error conditions removing the need for url for now
    return validationMessage;
  };

  const addNewRequest = () => {
    const warnings = requestValidationCheck();
    if (Object.keys(warnings).length > 0) {
      setWarningMessage(warnings);
      return;
    }

    newRequestsOpenAPI.openapiReqArray.forEach((req: $TSFixMe) => {
      const reqRes: ReqRes = {
        id: uuid(),
        createdAt: new Date(),
        host: `${newRequestsOpenAPI.openapiMetadata.serverUrls[0]}`,
        protocol: "http://",
        url: `${newRequestsOpenAPI.openapiMetadata.serverUrls[0]}${req.endpoint}`,
        graphQL,
        gRPC,
        webrtc,
        timeSent: null,
        timeReceived: null,
        connection: 'uninitialized',
        connectionType: null,
        checkSelected: false,
        request: {
          method: req.method,
          headers: headersArr.filter((header: $TSFixMe) => header.active && !!header.key),
          body: req.body,
          bodyType,
          rawType,
          network,
          restUrl,
          wsUrl,
          gqlUrl,
          testContent: testContent || '',
          grpcUrl,
        },
        response: {
          cookies: [],
          headers: {},
          stream: null,
          events: [],
        },
        checked: false,
        minimized: false,
        tab: currentTab,
      };
      console.log('Open_API_COmposer-> reqRes',reqRes)
      // add request to history
      /** @todo Fix TS type error */
      historyController.addHistoryToIndexedDb(reqRes);
      reqResItemAdded(reqRes);

      //reset for next request
      composerFieldsReset();

      newRequestBodySet({
        ...newRequestBody,
        bodyType: '',
        rawType: '',
      });
      fieldsReplaced({
        ...newRequestFields,
        url: `${newRequestsOpenAPI.openapiMetadata.serverUrls[0]}${req.endpoint}`,
        restUrl,
      });
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
      id="composer-openapi"
    >
      <div
        className="is-flex-grow-3 add-vertical-scroll container-margin"
        style={{ overflowX: 'hidden' }}
      >
        {/** @todo fix TS type error */}
        <OpenAPIEntryForm
          newRequestFields={newRequestFields}
          newRequestHeaders={newRequestHeaders}
          newRequestBody={newRequestBody}
          fieldsReplaced={fieldsReplaced}
          newRequestHeadersSet={newRequestHeadersSet}
          newRequestCookiesSet={newRequestCookiesSet}
          newRequestsOpenAPI={newRequestsOpenAPI}
          openApiRequestsReplaced={openApiRequestsReplaced}
          newRequestBodySet={newRequestBodySet}
          warningMessage={warningMessage}
          setWarningMessage={setWarningMessage}
        />

        <OpenAPIDocumentEntryForm
          newRequestFields={newRequestFields}
          fieldsReplaced={fieldsReplaced}
          newRequestHeaders={newRequestHeaders}
          newRequestHeadersSet={newRequestHeadersSet}
          newRequestCookiesSet={newRequestCookiesSet}
          newRequestsOpenAPI={newRequestsOpenAPI}
          openApiRequestsReplaced={openApiRequestsReplaced}
        />
        <OpenAPIMetadata newRequestsOpenAPI={newRequestsOpenAPI} />
        <OpenAPIServerForm
          newRequestsOpenAPI={newRequestsOpenAPI}
          openApiRequestsReplaced={openApiRequestsReplaced}
        />
      </div>
      <div className="is-3rem-footer is-clickable is-margin-top-auto">
        <NewRequestButton onClick={addNewRequest} />
      </div>
    </Box>
  );
}
