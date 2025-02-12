import React, { useState, useEffect, useRef } from 'react';
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

const WebRTCServerEntryForm: React.FC<Props> = () => {
  const dispatch = useAppDispatch();

  const newRequestWebRTC: RequestWebRTC = useAppSelector(
    (store: RootState) => store.newRequest.newRequestWebRTC
  );
  const [isToggled, setIsToggled] = useState(false);

  const handleToggleChange = () => {
    // toggles state os is toggled
    const newToggleState = !isToggled;
    setIsToggled(newToggleState);

    dispatch(
      //sends action to redux store
      // when dispatched redux store updates state based on action
      newRequestWebRTCSet({
        //creates action takes object as argument
        ...newRequestWebRTC,
        enableAudio: newToggleState, //updates Enableaudio property in newRequestWebRTC to match toggle state
      }) //enable audio updated every time toggle state changes
    );
  };
  //for testing audio only playback when other flaws are ruled out
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // creates reference html audio element
  //  where useRef persists values across renders without causing rerenders //initally set to null
  // useEffect(() => {
  //   // play audio when conditions are met
  //   if (newRequestWebRTC.webRTCLocalStream && audioRef.current) {
  //     // if local stream and current audio arent null
  //     console.log('Local Mic Playing...');
  //     audioRef.current.srcObject = newRequestWebRTC.webRTCLocalStream; // sets source of media to local stream
  //     audioRef.current
  //       .play()
  //       .catch((e) => console.warn('Electron Autoplay Issue', e)); // attempts to play it
  //   } // if error indicates it may be an issues with electron audioplayback vs video with audio
  // }, [newRequestWebRTCSet.webRTCLocalStream]); // use effect runs whenever local stream changes

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
          <button className="refresh-button">
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
            console.log(
              'value after dispatch, Im assuming it is the same:',
              value
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
          className="button is-normal is-primary-100 add-request-button no-border-please"
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
          className="button is-normal is-primary-100 add-request-button  no-border-please"
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
