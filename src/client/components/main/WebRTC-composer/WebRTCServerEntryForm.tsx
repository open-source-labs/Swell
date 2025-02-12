import React, { useEffect } from 'react';
import Joyride from 'react-joyride';
import { useState } from 'react';
import { MdRefresh } from 'react-icons/md';

// import '/Users/katharinehunt/Swell/src/assets/style/WebRtcEntry.css';
import '../../../../assets/style/WebRtc.css';

// import dropDownArrow from '../../../../assets/icons/arrow_drop_down_white_192x192.png';
// import CodeMirror from '@uiw/react-codemirror';
// import { EditorView } from '@codemirror/view';
// import { javascript } from '@codemirror/lang-javascript';
// import { vscodeDark } from '@uiw/codemirror-theme-vscode';
// import Select from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';
import { ReqRes, RequestWebRTC } from '../../../../types';
import TextCodeArea from '../sharedComponents/TextCodeArea';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../toolkit-refactor/hooks';
import { newRequestWebRTCSet } from '../../../toolkit-refactor/slices/newRequestSlice';
import webrtcPeerController from '../../../controllers/webrtcPeerController';
import { RootState } from '../../../toolkit-refactor/store';
import { compose } from 'redux';

// const jBeautify = require('js-beautify').js;

interface Props {
  // newRequestWebRTC: RequestWebRTC;
  // warningMessage: {
  //   body: string;
  // } | null;
}

const WebRTCServerEntryForm: React.FC<Props> = (props: Props) => {
  const [isToggled, setIsToggled] = useState(false);
  const [run, setRun] = useState(true);
  const dispatch = useAppDispatch();
  const newRequestWebRTC: RequestWebRTC = useAppSelector(
    (store: RootState) => store.newRequest.newRequestWebRTC
  );

  const steps = [
    {
      target: '.get-offer-button',
      content: 'Caller: Generate an offer by clicking “Get Offer”.',
      placement: 'bottom',
    },
    {
      target: '.copy-offer-button', // Target the "Copy" button in the Offer code box
      content:
        'Caller: Copy to clipboard, paste and send to recipient (email recommended).',
      placement: 'bottom',
    },
    {
      target: '.offer-paste-button',
      content: 'Recipient: Copy the offer received and paste into the top box',
    },
    {
      target: '.get-answer-btn',
      content: "Recipient: Click 'Get Answer' and copy it.",
    },
    // {
    //   target: ".answer-input-box",
    //   content: "Caller: Paste the answer here.",
    // },
    // {
    //   target: ".add-answer-btn",
    //   content: "Caller: Click 'Add Answer' to establish the connection.",
    // },
    // {
    //   target: ".add-to-workspace-btn-caller",
    //   content: "Caller: Click 'Add to Workspace'.",
    // },
    // {
    //   target: ".add-to-workspace-btn-recipient",
    //   content: "Recipient: Click 'Add to Workspace'.",
    // },
    // {
    //   target: ".send-btn-caller",
    //   content: "Caller: Click 'Send'.",
    // },
    // {
    //   target: ".send-btn-recipient",
    //   content: "Recipient: Click 'Send'.",
    // },
  ];
  // Use useEffect to start the joyride after the component mounts
  useEffect(() => {
    // Delay the start of Joyride to ensure everything is rendered
    const timer = setTimeout(() => setRun(true), 500);

    return () => clearTimeout(timer); // Clear the timer on cleanup
  }, []);

  return (
    <div className="mt-3">
      <div className="toggle-refresh-container">
        <div className="Audio-Toggle-Container">
          <span
            style={{
              fontFamily: "'Source Sans Pro', sans-serif",
              fontSize: '16px',
            }}
          >
            Audio
          </span>
          <label className="switch">
            <input
              type="checkbox"
              checked={isToggled}
              onChange={() => setIsToggled(!isToggled)}
            />
            <span className="slider round"></span>
          </label>
        </div>
        <div>
          <button className="refresh-button">
            <MdRefresh size={30} style={{ color: 'white' }} />{' '}
          </button>
        </div>
      </div>
      <div style={{ position: 'relative' }}>
        <TextCodeArea
          mode={'application/json'}
          value={newRequestWebRTC.webRTCOffer || ''}
          height={'85px'}
          onChange={(value, viewUpdate) => {
            console.log('value before dispatch:', value);
            dispatch(
              newRequestWebRTCSet({ ...newRequestWebRTC, webRTCOffer: value })
            );
            console.log(
              'value after dispatch, Im assuming it is the same:',
              value
            );
          }}
          placeholder={'Click "Get Offer" or paste in Offer SDP'}
          readOnly={true}
        />
        <div>
          <Joyride
            steps={steps}
            run={run}
            continuous
            showSkipButton
            disableOverlayClose={true}
            locale={{
              close: 'Close',
            }}
          />
          <button
            className="button is-small  copy-offer-button is-rest-invert"
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
            className="button is-small is-rest-invert offer-paste-button"
            style={{
              position: 'absolute',
              top: '60px',
              right: '20px',
              width: '58px',
            }}
            onClick={() => {
              navigator.clipboard.readText().then((text) => {
                console.log('text:', text);
                dispatch(
                  newRequestWebRTCSet({
                    ...newRequestWebRTC,
                    webRTCOffer: text,
                  })
                );
              });
            }}
          >
            Paste
          </button>
          <button
            className="button is-normal is-primary-100 add-request-button get-offer-button no-border-please"
            style={{ margin: '10px' }}
            onClick={() => {
              console.log('newRequestWebRTCfromOclick:', newRequestWebRTC);
              webrtcPeerController.createOffer(newRequestWebRTC);
            }}
          >
            Get Offer
          </button>

          <button
            id="webRTButton"
            className="button is-normal is-primary-100 add-request-button get-answer-btn no-border-please"
            style={{ margin: '10px' }}
            onClick={() => {
              console.log('newRequestWebRTCfromGAclick:', newRequestWebRTC);
              webrtcPeerController.createAnswer(newRequestWebRTC);
            }}
          >
            Get Answer
          </button>
        </div>
      </div>
      {/* Code box for Answer */}
      <div style={{ position: 'relative' }}>
        <TextCodeArea
          mode={'application/json'}
          value={newRequestWebRTC.webRTCAnswer || ''}
          height={'85px'}
          width={'100%'}
          onChange={(value, viewUpdate) => {
            dispatch(
              newRequestWebRTCSet({ ...newRequestWebRTC, webRTCAnswer: value })
            );
            console.log(
              'newRequestWebRTC (though may not be updated bc async):',
              newRequestWebRTC
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

        <button
          id="webRTButton"
          className="button is-normal is-primary-100 add-request-button  no-border-please"
          style={{ margin: '10px' }}
          onClick={() => {
            console.log('newRequestWebRTCfromAAclick:', newRequestWebRTC);
            webrtcPeerController.addAnswer(newRequestWebRTC);
          }}
        >
          Add Answer
        </button>
        {/* {warningMessage ? <div>{warningMessage.body}</div> : null} */}
      </div>
    </div>
  );
};

export default WebRTCServerEntryForm;
