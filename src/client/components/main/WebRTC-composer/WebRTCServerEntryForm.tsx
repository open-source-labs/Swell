import React from 'react';
// import dropDownArrow from '../../../../assets/icons/arrow_drop_down_white_192x192.png';
// import CodeMirror from '@uiw/react-codemirror';
// import { EditorView } from '@codemirror/view';
// import { javascript } from '@codemirror/lang-javascript';
// import { vscodeDark } from '@uiw/codemirror-theme-vscode';
// import Select from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';
import { RequestWebRTC } from '../../../../types';
import TextCodeArea from '../sharedComponents/TextCodeArea';
import { useAppDispatch, useAppSelector } from '../../../toolkit-refactor/hooks';
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
  const dispatch = useAppDispatch();
  const newRequestWebRTC: RequestWebRTC = useAppSelector(
    (store: RootState) => store.newRequest.newRequestWebRTC
  );

  return (
    <div className="mt-3">
      <div style={{ position: 'relative' }}>
        <TextCodeArea
          mode={'application/json'}
          value={newRequestWebRTC.webRTCOffer || ''}
          height={'85px'}
          onChange={(value, viewUpdate) => {
            dispatch(
              newRequestWebRTCSet({ ...newRequestWebRTC, webRTCOffer: value })
            );
          }}
          placeholder={'Click "Get Offer" or paste in Offer SDP'}
          readOnly={true}
        />
        <button
          className="button is-small is-rest-invert"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '58px',
          }}
          onClick={() => {
            navigator.clipboard.writeText(newRequestWebRTC.webRTCOffer);
          }}
        >
          Copy
        </button>
        <button
          className="button is-small is-rest-invert"
          style={{
            position: 'absolute',
            top: '60px',
            right: '20px',
            width: '58px',
          }}
          onClick={() => {
            navigator.clipboard.readText().then((text) =>
              dispatch(
                newRequestWebRTCSet({
                  ...newRequestWebRTC,
                  webRTCOffer: text,
                })
              )
            );
          }}
        >
          Paste
        </button>
        <button
          className="button is-normal is-primary-100 add-request-button no-border-please"
          style={{ margin: '10px' }}
          onClick={() => {
            webrtcPeerController.createOffer(newRequestWebRTC);
          }}
        >
          Get Offer
        </button>
      </div>
      {/* Code box for Answer */}
      <div style={{ position: 'relative' }}>
        <TextCodeArea
          mode={'application/json'}
          value={newRequestWebRTC.webRTCAnswer || ''}
          height={'85px'}
          onChange={(value, viewUpdate) => {
            dispatch(
              newRequestWebRTCSet({ ...newRequestWebRTC, webRTCAnswer: value })
            );
          }}
          placeholder={'Answer here'}
          readOnly={true}
        />
        <button
          className="button is-small is-rest-invert"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '58px',
          }}
          onClick={() => {
            navigator.clipboard.writeText(newRequestWebRTC.webRTCAnswer);
          }}
        >
          Copy
        </button>
        <button
          className="button is-small is-rest-invert"
          style={{
            position: 'absolute',
            top: '60px',
            right: '20px',
            width: '58px',
          }}
          onClick={() => {
            navigator.clipboard.readText().then((text) =>
              dispatch(
                newRequestWebRTCSet({
                  ...newRequestWebRTC,
                  webRTCAnswer: text,
                })
              )
            );
          }}
        >
          Paste
        </button>
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
    </div>
  );
};

export default WebRTCServerEntryForm;
