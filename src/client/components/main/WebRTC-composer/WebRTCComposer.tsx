import React, { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

import { ReqRes, RequestWebRTC, MainContainerProps } from '../../../../types';

/**
 * @todo Refactor all of the below components to use MUI, place them in a new
 * "components" folder
 */
import WebRTCSessionEntryForm from './WebRTCSessionEntryForm';
import WebRTCServerEntryForm from './WebRTCServerEntryForm';
import NewRequestButton from '../sharedComponents/requestButtons/NewRequestButton';
import webrtcPeerController from '../../../controllers/webrtcPeerController';
// Import MUI components
import { Box } from '@mui/material';

export default function WebRTCComposer(props: MainContainerProps) {
  const {
    composerFieldsReset,
    newRequestWebRTC,
    newRequestWebRTCSet,
    currentTab,
    warningMessage,
    reqResItemAdded,
    setWorkspaceActiveTab,
  } = props;

  const [peerConnectionOn, setPeerConnectionOn] = useState(false);

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
          newRequestWebRTC={newRequestWebRTC}
          newRequestWebRTCSet={newRequestWebRTCSet}
          warningMessage={warningMessage}
          setPeerConnectionOn = {setPeerConnectionOn}
        />

        {peerConnectionOn && (
          <>
            <WebRTCServerEntryForm
              newRequestWebRTC={newRequestWebRTC}
              newRequestWebRTCSet={newRequestWebRTCSet}
              createOffer={webrtcPeerController.createOffer}
              createAnswer={webrtcPeerController.createAnswer}
              warningMessage={warningMessage}
            />
            <div className="is-3rem-footer is-clickable is-margin-top-auto">
              <NewRequestButton onClick={addNewRequest} />
            </div>
            {newRequestWebRTC.webRTCDataChannel === 'Video' && (
              <div
                id="videos"
                style={{
                  height: 'fit-content',
                  width: 'fit-content',
                  backgroundColor: 'transparent',
                }}
              >
                <video
                  className="video-player"
                  id="user-1"
                  autoPlay
                  playsInline
                  style={{ width: '100%', height: '100%'}}
                ></video>
              </div>
            )}{' '}
          </>
        )}
      </div>
    </Box>
  );
}
