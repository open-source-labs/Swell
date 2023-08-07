import React from 'react';
import { v4 as uuid } from 'uuid';
// Import controllers
import historyController from '../../../controllers/historyController';
// Import local components
import { ReqRes, $TSFixMe } from '../../../../types';

/**
 * @todo Refactor all of the below components to use MUI, place them in a new
 * "components" folder
 */
import WebRTCSessionEntryForm from './WebRTCSessionEntryForm';
import WebRTCServerEntryForm from './WebRTCServerEntryForm';
import NewRequestButton from '../sharedComponents/requestButtons/NewRequestButton';
import TestEntryForm from '../sharedComponents/requestForms/TestEntryForm';
// Import MUI components
import { Box } from '@mui/material';

export default function WebRTCComposer(props: $TSFixMe) {
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
    const reqRes: ReqRes = {
      id: uuid(),
      createdAt: new Date(),
      protocol,
      host: '',
      path: '',
      graphQL,
      gRPC,
      webrtc: true,

      url,
      timeSent: null,
      timeReceived: null,
      connection: 'uninitialized',
      connectionType: null,
      checkSelected: false,
      webrtcData,
      request: {
        method,
        url,
        messages: [],
        body: bodyContent || '',
        bodyType,
        bodyVariables: bodyVariables || '',
        rawType,
        network: 'webRtc',
        restUrl,
        webrtcUrl,
      },
      response: {
        headers: null,
        events: [],
      },
      checked: false,
      minimized: false,
      tab: currentTab,
    };

    /** @todo Fix this TS type error  */
    historyController.addHistoryToIndexedDb(reqRes);
    reqResItemAdded(reqRes);

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
      sx={{ height: '100%', width: '100%' }}
      id="composer-webrtc"
    >
      <div
        className="is-flex-grow-3 add-vertical-scroll container-margin"
        style={{ overflowX: 'hidden' }}
      >
        {/** @todo Fix TSX type error */}
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
          isWebSocket={false}
        />
        <div className="is-3rem-footer is-clickable is-margin-top-auto">
          <NewRequestButton onClick={addNewRequest} />
        </div>
      </div>
    </Box>
  );
}
