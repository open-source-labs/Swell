import React from 'react';
import uuid from 'uuid/v4';
import historyController from '../../controllers/historyController';
import NewRequestButton from './NewRequest/NewRequestButton.jsx';
import OpenAPIEntryForm from './NewRequest/OpenAPIEntryForm';
import OpenAPIDocumentEntryForm from './NewRequest/OpenAPIDocumentEntryForm.jsx';
import OpenAPIMetadata from './NewRequest/OpenAPIMetadata.jsx';
import OpenAPIServerForm from './NewRequest/OpenAPIServerForm.jsx';

function OpenAPIContainer({
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
}) {
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
        created_at: new Date(),
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

  return (
    <div className="is-flex is-flex-direction-column is-justify-content-space-between is-tall">
      <div
        className="is-flex-grow-3 add-vertical-scroll"
        style={{ overflowX: 'hidden' }}
      >
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
    </div>
  );
}

export default OpenAPIContainer;
