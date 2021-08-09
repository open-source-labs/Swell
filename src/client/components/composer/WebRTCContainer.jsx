import React from 'react';
import uuid from 'uuid/v4';
import historyController from '../../controllers/historyController';
import WebRTCSessionEntryForm from './NewRequest/WebRTCSessionEntryForm.jsx';
import WebRTCServerEntryForm from './NewRequest/WebRTCServerEntryForm.jsx';
import NewRequestButton from './NewRequest/NewRequestButton.jsx';
import TestEntryForm from './NewRequest/TestEntryForm.jsx';

function WebRTCContainer({
  resetComposerFields,
  setNewRequestFields,
  newRequestFields,
  newRequestFields: {
    gRPC,
    url,
    method,
    protocol,
    graphQL,
    restUrl,
    webrtc,
    webrtcUrl,
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
  webrtcData,
  newRequestHeaders,
  setNewRequestCookies,
  setNewRequestStreams,
  newRequestStreams,
  currentTab,
  setComposerWarningMessage,
  setComposerDisplay,
  warningMessage,
  reqResAdd,
  setWorkspaceActiveTab,
}) {
  const requestValidationCheck = () => {
    const validationMessage = {};
    //if url is only http/https/ws/wss://
    if (/https?:\/\/$|wss?:\/\/$/.test(url)) {
      validationMessage.uri = 'Enter a valid URI';
    }
    //if url doesn't have http/https/ws/wss://
    if (!/(https?:\/\/)|(wss?:\/\/)/.test(url)) {
      validationMessage.uri = 'Enter a valid URI';
    }
    if (!JSONFormatted && rawType === 'application/json') {
      validationMessage.json = 'Please fix JSON body formatting errors';
    }

    return validationMessage;
  };

  const addNewRequest = () => {
    const warnings = requestValidationCheck();
    if (Object.keys(warnings).length > 0) {
      setComposerWarningMessage(warnings);
      return;
    }

    const protocol = url.match(/(https?:\/\/)|(wss?:\/\/)/)[0];

    const reqRes = {
      id: uuid(),
      created_at: new Date(),
      protocol,
      host: '',
      path: '',
      graphQL,
      gRPC,
      webrtc,
      url,
      timeSent: null,
      timeReceived: null,
      connection: 'uninitialized',
      connectionType: null,
      checkSelected: false,
      webrtcData,
      request: {
        method,
        webrtcData,
        url,
        messages: [],
        body: bodyContent || '',
        bodyType,
        bodyVariables: bodyVariables || '',
        rawType,
        network,
        restUrl,
        webrtcUrl,
      },
      response: {
        webrtcData,
        messages: [],
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
      bodyType: 'stun-ice',
      rawType: '',
    });
    setNewRequestFields({
      ...newRequestFields,
      url: webrtcUrl,
      webrtcUrl,
    });

    setWorkspaceActiveTab('workspace');
  };

  return (
    <div className="is-flex is-flex-direction-column is-justify-content-space-between is-tall">
      <div
        className="is-flex-grow-3 add-vertical-scroll"
        style={{ overflowX: 'hidden' }}
      >
        <WebRTCSessionEntryForm
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

        <WebRTCServerEntryForm
          warningMessage={warningMessage}
          newRequestBody={newRequestBody}
          setNewRequestBody={setNewRequestBody}
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

export default WebRTCContainer;
