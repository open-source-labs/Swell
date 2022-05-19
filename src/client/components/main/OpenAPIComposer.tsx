import React from 'react';
import { v4 as uuid } from 'uuid';
// Import controllers
import historyController from '../../controllers/historyController';
// Import local components
// TODO: refactor all of the below components to use MUI, place them in a new "components" folder
import NewRequestButton from './new-request/NewRequestButton.jsx';
import OpenAPIEntryForm from './new-request/OpenAPIEntryForm';
import OpenAPIDocumentEntryForm from './new-request/OpenAPIDocumentEntryForm.jsx';
import OpenAPIMetadata from './new-request/OpenAPIMetadata.jsx';
import OpenAPIServerForm from './new-request/OpenAPIServerForm.jsx';
// Import MUI components
import { Box } from '@mui/material'

export default function OpenAPIComposer(props) {
  const {
    resetComposerFields,
    setNewRequestsOpenAPI,
    newRequestsOpenAPI,
    setNewRequestFields,
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
    setNewRequestBody,
    newRequestBody,
    newRequestBody: { rawType, bodyType },
    setNewRequestHeaders,
    newRequestHeaders,
    newRequestHeaders: { headersArr },
    setNewRequestCookies,
    currentTab,
    setComposerWarningMessage,
    warningMessage,
    reqResAdd,
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
      setComposerWarningMessage(warnings);
      return;
    }

    newRequestsOpenAPI.openapiReqArray.forEach((req) => {
      const reqRes = {
        id: uuid(),
        createdAt: new Date(),
        host: `${newRequestsOpenAPI.openapiMetadata.serverUrls[0]}`,
        protocol: 'https://',
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
          headers: headersArr.filter((header) => header.active && !!header.key),
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

      // add request to history
      // TODO: fix TS type error
      historyController.addHistoryToIndexedDb(reqRes);
      reqResAdd(reqRes);

      //reset for next request
      resetComposerFields();

      setNewRequestBody({
        ...newRequestBody,
        bodyType: '',
        rawType: '',
      });
      setNewRequestFields({
        ...newRequestFields,
        url: `${newRequestsOpenAPI.openapiMetadata.serverUrls[0]}${req.endpoint}`,
        restUrl,
      });
    });

    setWorkspaceActiveTab('workspace');
  };

  return(
    <Box className="is-flex is-flex-direction-column is-justify-content-space-between" id= "composer-openapi">
        <div
          className="is-flex-grow-3 add-vertical-scroll"
          style={{ overflowX: 'hidden' }}
        >
          {/* TODO: fix TS type error */}
          <OpenAPIEntryForm
            newRequestFields={newRequestFields}
            newRequestHeaders={newRequestHeaders}
            newRequestBody={newRequestBody}
            setNewRequestFields={setNewRequestFields}
            setNewRequestHeaders={setNewRequestHeaders}
            setNewRequestCookies={setNewRequestCookies}
            newRequestsOpenAPI={newRequestsOpenAPI}
            setNewRequestsOpenAPI={setNewRequestsOpenAPI}
            setNewRequestBody={setNewRequestBody}
            warningMessage={warningMessage}
            setComposerWarningMessage={setComposerWarningMessage}
          />

          <OpenAPIDocumentEntryForm
            newRequestFields={newRequestFields}
            setNewRequestFields={setNewRequestFields}
            newRequestHeaders={newRequestHeaders}
            setNewRequestHeaders={setNewRequestHeaders}
            setNewRequestCookies={setNewRequestCookies}
            newRequestsOpenAPI={newRequestsOpenAPI}
            setNewRequestsOpenAPI={setNewRequestsOpenAPI}
          />
          <OpenAPIMetadata newRequestsOpenAPI={newRequestsOpenAPI} />
          <OpenAPIServerForm
            newRequestsOpenAPI={newRequestsOpenAPI}
            setNewRequestsOpenAPI={setNewRequestsOpenAPI}
          />
        </div>
        <div className="is-3rem-footer is-clickable is-margin-top-auto">
          <NewRequestButton onClick={addNewRequest} />
        </div>
    </Box>
  )

}
