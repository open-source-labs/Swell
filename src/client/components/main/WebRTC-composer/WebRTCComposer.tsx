import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';

import { ReqRes, RequestWebRTC, MainContainerProps } from '../../../../types';

/**
 * @todo Refactor all of the below components to use MUI, place them in a new
 * "components" folder
 */
import WebRTCSessionEntryForm from './WebRTCSessionEntryForm';
import WebRTCServerEntryForm from './WebRTCServerEntryForm';
import NewRequestButton from '../sharedComponents/requestButtons/NewRequestButton';
// Import MUI components
import { Box } from '@mui/material';
import WebRTCVideoBox from './WebRTCVideoBox';

export default function WebRTCComposer(props: MainContainerProps) {
  const {
    composerFieldsReset,
    newRequestWebRTC,
    currentTab,
    warningMessage,
    reqResItemAdded,
    setWorkspaceActiveTab,
  } = props;

  const [showRTCEntryForms, setShowRTCEntryForms] = useState(false);

  // Builds ReqRes object from properties in NewRequest
  const composeReqRes = (): ReqRes => {
    const requestWebRTC: RequestWebRTC = {
      network: newRequestWebRTC.network,
      webRTCEntryMode: newRequestWebRTC.webRTCEntryMode,
      webRTCDataChannel: newRequestWebRTC.webRTCDataChannel,
      webRTCWebsocketServer: null,
      webRTCOffer: newRequestWebRTC.webRTCOffer,
      webRTCAnswer: newRequestWebRTC.webRTCAnswer,
      webRTCpeerConnection: newRequestWebRTC.webRTCpeerConnection,
      webRTCLocalStream: newRequestWebRTC.webRTCLocalStream,
      webRTCRemoteStream: newRequestWebRTC.webRTCRemoteStream,
    };

    const reqRes: ReqRes = {
      id: uuid(),
      createdAt: new Date(),
      path: '',
      timeSent: null,
      timeReceived: null,
      connection: 'uninitialized',
      connectionType: null,
      checkSelected: false,
      request: requestWebRTC,
      response: {
        webRTC: true,
      },
      checked: false,
      minimized: false,
      tab: currentTab,
    };

    return reqRes;
  };

  const addNewRequest = (): void => {
    const reqRes: ReqRes = composeReqRes();

    // addHistory removed because RTCPeerConnection objects cant typically be cloned
    // historyController.addHistoryToIndexedDb(reqRes);

    reqResItemAdded(reqRes);
    composerFieldsReset();
    setShowRTCEntryForms(false)
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
        <WebRTCSessionEntryForm
          // newRequestWebRTC={newRequestWebRTC}
          // warningMessage={warningMessage}
          setShowRTCEntryForms={setShowRTCEntryForms}
        />

        {showRTCEntryForms && (
          <>
            <WebRTCServerEntryForm
              // warningMessage={warningMessage}
            />
            <div className="is-3rem-footer is-clickable is-margin-top-auto">
              <NewRequestButton onClick={addNewRequest} />
            </div>
            {newRequestWebRTC.webRTCDataChannel === 'Video' && (
              <div className='box is-rest-invert'>
                <WebRTCVideoBox streamType="localstream" />
              </div>
            )}
          </>
        )}
      </div>
    </Box>
  );
}
