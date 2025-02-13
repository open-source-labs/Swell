import React from 'react';
import Joyride from 'react-joyride';
import { useState, useRef, useEffect } from 'react';
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
import {
  resetWebRTCconnection,
  newRequestWebRTCSet,
} from '../../../toolkit-refactor/slices/newRequestSlice';
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
  const currentReqRes = useAppSelector(
    (store: RootState) => store.reqRes.currentResponse
  ) as ReqRes;

  useEffect(() => {
    setIsToggled(newRequestWebRTC.enableAudio as boolean);
  }, [newRequestWebRTC.enableAudio]);

  const handleToggleChange = () => {
    // toggles state os is toggled
    const newToggleState = !isToggled;
    setIsToggled(newToggleState);
    // console.log(
    //   'Dispatching newRequestWebRTCSet with enableAudio for handleToggleChange:',
    //   newToggleState
    // );

    dispatch(
      //sends action to redux store
      // when dispatched redux store updates state based on action
      newRequestWebRTCSet({
        //creates action takes object as argument
        ...newRequestWebRTC,
        enableAudio: newToggleState, //updates Enableaudio property in newRequestWebRTC to match toggle state
      }) //enable audio updated every time toggle state changes
    );

    // console.log(
    //   'enableAudio Redux state just after dispatch:',
    //   newRequestWebRTC.enableAudio
    // );
    webrtcPeerController.createPeerConnection(
      {
        ...newRequestWebRTC,
        enableAudio: newToggleState,
      },
      currentReqRes
    );
  };
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
      placement: 'bottom',
    },
    {
      target: '.get-answer-btn',
      content: "Recipient: Click 'Get Answer' and copy it.",
      placement: 'bottom',
    },
    {
      target: '.answer-paste-button',
      content: 'Caller: Paste the answer here.',
    },
    {
      target: '.add-answer-btn',
      content:
        "Caller: Click 'Add Answer' to establish the connection. Then click 'Add to Workspace' button below",
    },
    {
      target: '.add-to-workspace-btn',
      content: "Caller: Click 'Add to Workspace'.",
    },
  ];
  // Use useEffect to start the joyride after the component mounts
  useEffect(() => {
    // Delay the start of Joyride to ensure everything is rendered
    const timer = setTimeout(() => setRun(true), 500);

    return () => clearTimeout(timer); // Clear the timer on cleanup
  }, []);

  const hasResetRef = useRef(false);

  const handleResetWebRTCconnection = () => {
    dispatch(resetWebRTCconnection());
    console.log('WebRTC connection reset to initial state:');
    console.log('newRequestWebRTCFromConnect:', {
      newRequestWebRTC: newRequestWebRTC, // This will be the empty reset state
    });
    hasResetRef.current = true;
  };

  useEffect(() => {
    // so we only trigger a new peer connection here for the reset if the offer has been cleared specifically via our reset function
    if (hasResetRef.current && newRequestWebRTC.webRTCOffer === '') {
      console.log('Creating a new Peer Connection with reset state');
      webrtcPeerController.createPeerConnection(
        newRequestWebRTC,
        currentReqRes
      );
      hasResetRef.current = false;
    }
  }, [newRequestWebRTC, currentReqRes]);

  return (
    <div className="mt-3">
      <div className="toggle-refresh-container">
        <div className="Audio-Toggle-Container">
          {newRequestWebRTC.webRTCDataChannel === 'Video' && (
            <>
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
                  onChange={handleToggleChange} //handle toggle changed called on change of switch
                />
                <span
                  className={`slider round ${isToggled ? 'slider-on' : ''}`}
                ></span>
              </label>
            </>
          )}
        </div>

        <div>
          <button
            className="refresh-button"
            onClick={handleResetWebRTCconnection}
          >
            <MdRefresh size={30} style={{ color: 'white' }} />
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
            // console.log(
            //   'value after dispatch, Im assuming it is the same:',
            //   value
            // );
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
              if (!newRequestWebRTC.webRTCpeerConnection) {
                console.warn(
                  'webRTCpeerConnection is NULL! createPeerConnection may not have run.'
                );
              }
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
        {/* Code box for Answer */}
        <div style={{ position: 'relative' }}>
          <TextCodeArea
            mode={'application/json'}
            value={newRequestWebRTC.webRTCAnswer || ''}
            height={'85px'}
            width={'100%'}
            onChange={(value, viewUpdate) => {
              dispatch(
                newRequestWebRTCSet({
                  ...newRequestWebRTC,
                  webRTCAnswer: value,
                })
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
            className="button is-small is-rest-invert answer-paste-button"
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
            className="button is-normal is-primary-100 add-request-button  add-answer-btn no-border-please"
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
    </div>
  );
};

export default WebRTCServerEntryForm;
