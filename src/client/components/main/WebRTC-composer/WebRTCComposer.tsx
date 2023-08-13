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
import { useSelector } from 'react-redux';
import { RootState } from '../../../toolkit-refactor/store';
import { useDispatch } from 'react-redux';
import { composerFieldsReset } from '../../../toolkit-refactor/slices/newRequestSlice';
import { setWorkspaceActiveTab } from '../../../toolkit-refactor/slices/uiSlice';
import { reqResItemAdded } from '../../../toolkit-refactor/slices/reqResSlice';

export default function WebRTCComposer() {
  const dispatch = useDispatch();
  const newRequestWebRTC: RequestWebRTC = useSelector(
    (store: RootState) => store.newRequest.newRequestWebRTC
  );

  const [showRTCEntryForms, setShowRTCEntryForms] = useState(false);

  // Builds ReqRes object from properties in NewRequest
  const composeReqRes = (): ReqRes => {
    return {
      id: uuid(),
      createdAt: new Date(),
      path: '',
      timeSent: null,
      timeReceived: null,
      connection: 'uninitialized',
      connectionType: null,
      checkSelected: false,
      request: newRequestWebRTC,
      response: {
        webRTC: true,
      },
      checked: false,
      minimized: false,
    };
  };

  const addNewRequest = (): void => {
    const reqRes: ReqRes = composeReqRes();

    // addHistory removed because RTCPeerConnection objects cant typically be cloned
    // historyController.addHistoryToIndexedDb(reqRes);

    dispatch(reqResItemAdded(reqRes));
    dispatch(composerFieldsReset());
    setShowRTCEntryForms(false);
    dispatch(setWorkspaceActiveTab('workspace'));
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
              <div className="box is-rest-invert">
                <WebRTCVideoBox streamType="localstream" />
              </div>
            )}
          </>
        )}
      </div>
    </Box>
  );
}
