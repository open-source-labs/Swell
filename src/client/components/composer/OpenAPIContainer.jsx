import React from 'react';
import uuid from 'uuid/v4';
import HeaderEntryForm from './NewRequest/HeaderEntryForm.jsx';
import historyController from '../../controllers/historyController';
import NewRequestButton from './NewRequest/NewRequestButton.jsx';
import OpenAPIEntryForm from './NewRequest/OpenAPIEntryForm';
import OpenAPIDocumentEntryForm from './NewRequest/OpenAPIDocumentEntryForm.jsx';

function OpenAPIContainer({
  resetComposerFields,
  setNewRequestsOpenAPI,
  newRequestsOpenAPI,
  setNewRequestFields,
  newRequestFields,
  newRequestFields: {
    gRPC,
    url,
    method,
    webrtc,
    openapi,
    protocol,
    graphQL,
    restUrl,
    wsUrl,
    gqlUrl,
    grpcUrl,
    network,
    testContent,
  },
  setNewRequestBody,
  setNewTestContent,
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

  currentTab,
  setComposerWarningMessage,
  setComposerDisplay,
  warningMessage,
  reqResAdd,
  setWorkspaceActiveTab,
}) {
  const requestValidationCheck = () => {
    const validationMessage = {};
    //!Error conditions removing the need for url for now

    return validationMessage;
  };

  const addNewRequest = () => {
    console.log(newRequestFields);

    console.log(
      newRequestsOpenAPI.openapiMetadata,
      newRequestsOpenAPI.openapiReqArray
    );

    const warnings = requestValidationCheck();
    if (Object.keys(warnings).length > 0) {
      setComposerWarningMessage(warnings);
      return;
    }

    newRequestsOpenAPI.openapiMetadata.openapiReqArray.forEach((req) => {
      const reqRes = {
        id: uuid(),
        created_at: new Date(),
        host: 'https://api.twitter.com',
        protocol: 'https://',
        url: `https://api.twitter.com${req.endpoint}`,
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

      // GRPC REQUESTS
      setNewRequestBody({
        ...newRequestBody,
        bodyType: 'GRPC',
        rawType: '',
      });
      setNewRequestFields({
        ...newRequestFields,
        url: `https://api.twitter.com${req.endpoint}`,
        restUrl,
      });
    });

    setWorkspaceActiveTab('workspace');
  };

  const HeaderEntryFormStyle = {
    //trying to change style to conditional created strange duplication effect when continuously changing protocol
    display: !/wss?:\/\//.test(protocol) ? 'block' : 'none',
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
        <HeaderEntryForm
          stylesObj={HeaderEntryFormStyle}
          newRequestHeaders={newRequestHeaders}
          newRequestBody={newRequestBody}
          newRequestFields={newRequestFields}
          setNewRequestHeaders={setNewRequestHeaders}
        />
      </div>
      <div className="is-3rem-footer is-clickable is-margin-top-auto">
        <NewRequestButton onClick={addNewRequest} />
      </div>
    </div>
  );
}

export default OpenAPIContainer;
