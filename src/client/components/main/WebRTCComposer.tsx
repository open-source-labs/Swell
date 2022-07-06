import React from 'react';
import { v4 as uuid } from 'uuid';
// Import controllers
import historyController from '../../controllers/historyController';
// Import local components
// TODO: refactor all of the below components to use MUI, place them in a new "components" folder
import WebRTCSessionEntryForm from './new-request/WebRTCSessionEntryForm.jsx';
import WebRTCServerEntryForm from './new-request/WebRTCServerEntryForm.jsx';
import NewRequestButton from './new-request/NewRequestButton.jsx';
import TestEntryForm from './new-request/TestEntryForm.jsx';
// Import MUI components
import { Box } from '@mui/material';

export default function WebRTCComposer(props) {
  const {
    composerFieldsReset,
    fieldsReplaced,
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
    newTestContentSet,
    newRequestBodySet,
    newRequestBody,
    newRequestBody: { rawType, bodyContent, bodyVariables, bodyType },
    newRequestHeadersSet,
    webrtcData,
    newRequestHeaders,
    newRequestCookiesSet,
    newRequestStreamsSet,
    newRequestStreams,
    currentTab,
    setWarningMessage,
    warningMessage,
    reqResItemAdded,
    setWorkspaceActiveTab,
  } = props;

  const addNewRequest = () => {
    const reqRes = {
      id: uuid(),
      createdAt: new Date(),
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
    // TODO: fix this TS type error
    historyController.addHistoryToIndexedDb(reqRes);
    reqResItemAdded(reqRes);

    //reset for next request
    composerFieldsReset();

    newRequestBodySet({
      ...newRequestBody,
      bodyType: 'stun-ice',
      rawType: '',
    });
    fieldsReplaced({
      ...newRequestFields,
      url,
      webrtcUrl,
    });

    setWorkspaceActiveTab('workspace');
  };

  return (
    <Box
      className="is-flex is-flex-direction-column is-justify-content-space-between"
      id="composer-webrtc"
    >
      <div
        className="is-flex-grow-3 add-vertical-scroll"
        style={{ overflowX: 'hidden' }}
      >
        {/* TODO: fix TSX type error */}
        <WebRTCSessionEntryForm
          newRequestFields={newRequestFields}
          newRequestHeaders={newRequestHeaders}
          newRequestStreams={newRequestStreams}
          newRequestBody={newRequestBody}
          fieldsReplaced={fieldsReplaced}
          newRequestHeadersSet={newRequestHeadersSet}
          newRequestStreamsSet={newRequestStreamsSet}
          newRequestCookiesSet={newRequestCookiesSet}
          newRequestBodySet={newRequestBodySet}
          warningMessage={warningMessage}
          setWarningMessage={setWarningMessage}
          newTestContentSet={newTestContentSet}
        />

        <WebRTCServerEntryForm
          warningMessage={warningMessage}
          newRequestBody={newRequestBody}
          newRequestBodySet={newRequestBodySet}
        />

        <TestEntryForm
          newTestContentSet={newTestContentSet}
          testContent={testContent}
        />
      </div>
      <div className="is-3rem-footer is-clickable is-margin-top-auto">
        <NewRequestButton onClick={addNewRequest} />
      </div>
    </Box>
  );
}
