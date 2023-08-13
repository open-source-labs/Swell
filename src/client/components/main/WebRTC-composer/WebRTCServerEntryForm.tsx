import React from 'react';
import { useSelector } from 'react-redux';
// import dropDownArrow from '../../../../assets/icons/arrow_drop_down_white_192x192.png';
// import CodeMirror from '@uiw/react-codemirror';
// import { EditorView } from '@codemirror/view';
// import { javascript } from '@codemirror/lang-javascript';
// import { vscodeDark } from '@uiw/codemirror-theme-vscode';
// import Select from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';
import { RequestWebRTC } from '../../../../types';
import TextCodeArea from '../sharedComponents/TextCodeArea';
import { useDispatch } from 'react-redux';
import { newRequestWebRTCSet } from '../../../toolkit-refactor/slices/newRequestSlice';
import webrtcPeerController from '../../../controllers/webrtcPeerController';
import { RootState } from '../../../toolkit-refactor/store';

// const jBeautify = require('js-beautify').js;

interface Props {
  // newRequestWebRTC: RequestWebRTC;
  // warningMessage: {
  //   body: string;
  // } | null;
}

const WebRTCServerEntryForm: React.FC<Props> = (props: Props) => {
  const dispatch = useDispatch();
  const newRequestWebRTC: RequestWebRTC = useSelector(
    (store: RootState) => store.newRequest.newRequestWebRTC
  );

  return (
    <div className="mt-3">
      <TextCodeArea
        mode={'application/json'}
        value={newRequestWebRTC.webRTCOffer || ''}
        height={'80px'}
        onChange={(value, viewUpdate) => {
          dispatch(
            newRequestWebRTCSet({ ...newRequestWebRTC, webRTCOffer: value })
          );
        }}
        placeholder={'Click "Get Offer" or paste in Offer SDP'}
        readOnly={newRequestWebRTC.webRTCEntryMode === 'WS'}
      />
      <button
        className="button is-normal is-primary-100 add-request-button  no-border-please"
        style={{ margin: '10px' }}
        onClick={() => {
          webrtcPeerController.createOffer(newRequestWebRTC);
        }}
      >
        Get Offer
      </button>
      {/* Code box for Answer */}
      <TextCodeArea
        mode={'application/json'}
        value={newRequestWebRTC.webRTCAnswer || ''}
        height={'80px'}
        onChange={(value, viewUpdate) => {
          dispatch(
            newRequestWebRTCSet({ ...newRequestWebRTC, webRTCAnswer: value })
          );
        }}
        placeholder={'Answer here'}
        readOnly={newRequestWebRTC.webRTCEntryMode === 'WS'}
      />
      {/* ANSWER BUTTON IS WORK-IN-PROGRESS */}
      {/* <button
        id="webRTButton"
        className="button is-normal is-primary-100 add-request-button  no-border-please"
        style={{ margin: '10px' }}
        onClick={() => {
          createAnswer(newRequestWebRTC);
        }}
      >
        Get Answer
      </button> */}
      {/* {warningMessage ? <div>{warningMessage.body}</div> : null} */}
    </div>
  );
};

export default WebRTCServerEntryForm;
