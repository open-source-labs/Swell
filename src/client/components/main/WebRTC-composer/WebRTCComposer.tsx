import React, { useEffect } from 'react';
import { v4 as uuid } from 'uuid';
// Import controllers
import historyController from '../../../controllers/historyController';
// Import local components
import { ReqRes, RequestWebRTC, MainContainerProps } from '../../../../types';

/**
 * @todo Refactor all of the below components to use MUI, place them in a new
 * "components" folder
 */
import WebRTCSessionEntryForm from './WebRTCSessionEntryForm';
import WebRTCServerEntryForm from './WebRTCServerEntryForm';
import NewRequestButton from '../sharedComponents/requestButtons/NewRequestButton';
// import TestEntryForm from '../sharedComponents/requestForms/TestEntryForm';
import webrtcPeerController from '../../../controllers/webrtcPeerController';
// Import MUI components
import { Box } from '@mui/material';

export default function WebRTCComposer(props: MainContainerProps) {
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
    newRequestWebRTCSet,
    newRequestWebRTCOfferSet,
    newRequestBody,
    newRequestBody: { rawType, bodyContent, bodyVariables, bodyType },
    newRequestHeadersSet,
    // webrtcData,
    newRequestHeaders,
    newRequestCookiesSet,
    newRequestStreamsSet,
    newRequestStreams,
    currentTab,
    setWarningMessage,
    warningMessage,
    reqResItemAdded,
    setWorkspaceActiveTab,
    newRequestWebRTC,
  } = props;

  /* 
  newRequestWebRTCSet(...newRequestWebRTC, )
  */

  useEffect(() => {
    webrtcPeerController.createPeerConnection(newRequestWebRTC);
  }, []);

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
      // protocol,
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
      // webrtcData,
      request: requestWebRTC,
      response: {
        headers: null,
        events: [],
      },
      checked: false,
      minimized: false,
      tab: currentTab,
    };

    return reqRes;
  };

  // Saves ReqRes object into history and ReqResArray
  const addNewRequest = (): void => {
    const reqRes: ReqRes = composeReqRes();

    // historyController.addHistoryToIndexedDb(reqRes);

    reqResItemAdded(reqRes);
    composerFieldsReset();
    // newRequestBodySet({
    //   ...newRequestBody,
    //   bodyType: 'stun-ice',
    //   rawType: '',
    // });
    // fieldsReplaced({
    //   ...newRequestFields,
    //   url,
    //   webrtcUrl,
    // });
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
          newRequestWebRTC={newRequestWebRTC}
          newRequestWebRTCSet={newRequestWebRTCSet}
          // newRequestHeaders={newRequestHeaders}
          // newRequestStreams={newRequestStreams}
          // newRequestBody={newRequestBody}
          fieldsReplaced={fieldsReplaced}
          // newRequestHeadersSet={newRequestHeadersSet}
          // newRequestStreamsSet={newRequestStreamsSet}
          // newRequestCookiesSet={newRequestCookiesSet}
          // newRequestBodySet={newRequestBodySet}
          warningMessage={warningMessage}
          // setWarningMessage={setWarningMessage}
          // newTestContentSet={newTestContentSet}
        />

        <WebRTCServerEntryForm
          newRequestWebRTC={newRequestWebRTC}
          newRequestWebRTCSet={newRequestWebRTCSet}
          newRequestWebRTCOfferSet={newRequestWebRTCOfferSet}
          createOffer={webrtcPeerController.createOffer}
          createAnswer={webrtcPeerController.createAnswer}
          warningMessage={warningMessage}
          // newRequestBody={newRequestBody}
          // newRequestBodySet={newRequestBodySet}
        />

        {/* <TestEntryForm
          newTestContentSet={newTestContentSet}
          testContent={testContent}
          isWebSocket={false}
        /> */}
        <div className="is-3rem-footer is-clickable is-margin-top-auto">
          <NewRequestButton onClick={addNewRequest} />
        </div>
        <div id="videos" style={{height: 'fit-content', width: 'fit-content', backgroundColor: 'transparent', }}>
          <video className="video-player" id="user-1" autoPlay playsInline style={{width:'100%', height: '100%', border: 'solid black'}}></video>
        </div>
      </div>
    </Box>
  );
}
