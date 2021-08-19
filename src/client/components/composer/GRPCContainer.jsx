import React from 'react';
import uuid from 'uuid/v4';
import GRPCProtoEntryForm from './NewRequest/GRPCProtoEntryForm.jsx';
import HeaderEntryForm from './NewRequest/HeaderEntryForm.jsx';
import historyController from '../../controllers/historyController';
import GRPCTypeAndEndpointEntryForm from './NewRequest/GRPCTypeAndEndpointEntryForm';
import NewRequestButton from './NewRequest/NewRequestButton.jsx';
import TestEntryForm from './NewRequest/TestEntryForm';

function GRPCContainer({
  resetComposerFields,
  setNewRequestFields,
  newRequestFields,
  newRequestFields: {
    gRPC,
    url,
    webrtc,
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
  newRequestBody: { rawType, bodyType },
  setNewRequestHeaders,
  newRequestHeaders,
  newRequestHeaders: { headersArr },
  setNewRequestCookies,
  newRequestCookies: { cookiesArr },
  setNewRequestStreams,
  newRequestStreams,
  newRequestStreams: {
    selectedService,
    selectedRequest,
    selectedPackage,
    streamingType,
    initialQuery,
    streamsArr,
    streamContent,
    services,
    protoPath,
    protoContent,
  },
  newRequestSSE: { isSSE },
  currentTab,
  setComposerWarningMessage,
  warningMessage,
  reqResAdd,
  setWorkspaceActiveTab,
}) {
  const requestValidationCheck = () => {
    const validationMessage = {};
    //Error conditions...
    if (newRequestFields.grpcUrl) return true;
    validationMessage.uri = 'Enter a valid URI';
    return validationMessage;
  };

  const addNewRequest = () => {
    const warnings = requestValidationCheck();
    if (Object.keys(warnings).length > 0) {
      setComposerWarningMessage(warnings);
      return;
    }

    // saves all stream body queries to history & reqres request body
    let streamQueries = '';
    for (let i = 0; i < streamContent.length; i++) {
      // queries MUST be in format, do NOT edit template literal unless necessary
      streamQueries += `${streamContent[i]}`;
    }
    // define array to hold client query strings
    const queryArrStr = streamContent;
    const queryArr = [];
    // scrub client query strings to remove line breaks
    // convert strings to objects and push to array
    for (let i = 0; i < queryArrStr.length; i += 1) {
      let query = queryArrStr[i];
      const regexVar = /\r?\n|\r|↵/g;
      query = query.replace(regexVar, '');
      queryArr.push(JSON.parse(query));
    }
    // grabbing streaming type to set method in reqRes.request.method
    const grpcStream = document.getElementById('stream').innerText;
    // create reqres obj to be passed to controller for further actions/tasks
    const reqRes = {
      id: uuid(),
      created_at: new Date(),
      protocol: '',
      url,
      graphQL,
      gRPC,
      webrtc,
      timeSent: null,
      timeReceived: null,
      connection: 'uninitialized',
      connectionType: null,
      checkSelected: false,
      request: {
        method: grpcStream,
        headers: headersArr.filter((header) => header.active && !!header.key),
        body: streamQueries,
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
      service: selectedService,
      rpc: selectedRequest,
      packageName: selectedPackage,
      streamingType,
      queryArr,
      initialQuery,
      streamsArr,
      streamContent,
      servicesObj: services,
      protoPath,
      protoContent,
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
      url: grpcUrl,
      grpcUrl,
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
        <GRPCTypeAndEndpointEntryForm
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
        />
        <HeaderEntryForm
          stylesObj={HeaderEntryFormStyle}
          newRequestHeaders={newRequestHeaders}
          newRequestStreams={newRequestStreams}
          newRequestBody={newRequestBody}
          newRequestFields={newRequestFields}
          setNewRequestHeaders={setNewRequestHeaders}
          setNewRequestStreams={setNewRequestStreams}
        />
        <GRPCProtoEntryForm
          newRequestStreams={newRequestStreams}
          setNewRequestStreams={setNewRequestStreams}
        />
        <TestEntryForm
          setNewTestContent={setNewTestContent}
          testContent={testContent}
        />
      </div>
      <div className="is-3rem-footer is-clickable is-margin-top-auto">
        <NewRequestButton onClick={addNewRequest} />
      </div>
    </div>
  );
}

export default GRPCContainer;
