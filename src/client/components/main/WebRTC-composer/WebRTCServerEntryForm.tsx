import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import dropDownArrow from '../../../../assets/icons/arrow_drop_down_white_192x192.png';
import CodeMirror from '@uiw/react-codemirror';
import { EditorView } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import {
  $TSFixMe,
  NewRequestWebRTCSet,
  RequestWebRTC,
} from '../../../../types';
import TextCodeArea from '../sharedComponents/TextCodeArea';

// const jBeautify = require('js-beautify').js;

interface Props {
  newRequestWebRTC: RequestWebRTC;
  newRequestWebRTCSet: NewRequestWebRTCSet;
  warningMessage: {
    body: string;
  } | null;
}

const WebRTCServerEntryForm: React.FC<Props> = (props: Props) => {
  let { newRequestWebRTC, newRequestWebRTCSet } = props;
  let [dataTypeDropdownIsActive, setDataTypeDropdownIsActive] = useState(false);

  const requestBody = useSelector(
    (state: any) => state.newRequest.newRequestBody
  );
  const { bodyIsNew } = requestBody;
  const [cmValue, setValue] = useState<string>('');
  const isDark = useSelector((state: any) => state.ui.isDark);

  // const bodyContent = useSelector(
  //   (state: any) => state.newRequest.newRequestBody.bodyContent
  // );
  // useEffect(() => {
  //   if (!bodyIsNew) {
  //     /**
  //      * @todo This code randomly causes parts of the app to crash. As in, it
  //      * will randomly decide to start or stop working without you changing
  //      * anything. Need to investigate
  //      *
  //      * (OR needs to be re-built....
  //      *          - another iteration group)
  //      */
  //     // setValue(
  //     //   jBeautify(JSON.stringify(bodyContent?.iceConfiguration?.iceServers))
  //     // );
  //   }
  // }, [bodyContent, bodyIsNew]);
  useEffect(() => {
    let servers = {
      iceServers: [
        {
          urls: [
            'stun:stun1.1.google.com:19302',
            'stun:stun2.1.google.com:19302',
          ],
        },
      ],
    };
    let peerConnection = new RTCPeerConnection(servers);
    newRequestWebRTCSet({
      ...newRequestWebRTC,
      webRTCpeerConnection: peerConnection,
    });
  }, []);

  const createOffer = async () => {
    const { webRTCpeerConnection } = newRequestWebRTC;
    let offer = await webRTCpeerConnection.createOffer();
    newRequestWebRTCSet({
      ...newRequestWebRTC,
      webRTCOffer: JSON.stringify(offer),
    });
  };

  return (
    <div className="mt-3">
      <div
        className={` is-flex dropdown ${
          dataTypeDropdownIsActive ? 'is-active' : ''
        }`}
        style={{ padding: '10px' }}
      >
        <div className="dropdown-trigger">
          <button
            className="is-rest button no-border-please"
            id="rest-method"
            aria-haspopup="true"
            aria-controls="dropdown-menu"
            onClick={() =>
              setDataTypeDropdownIsActive(!dataTypeDropdownIsActive)
            }
          >
            <span>{newRequestWebRTC.webRTCDataChannel}</span>
            <span className="icon is-medium">
              <img
                src={dropDownArrow}
                className="arrow-drop-down is-awesome-icon"
                aria-hidden="true"
                alt="dropdown arrow"
              />
            </span>
          </button>
        </div>

        <div className="dropdown-menu" id="dropdown-menu">
          <ul className="dropdown-content">
            {newRequestWebRTC.webRTCDataChannel !== 'Audio' && (
              <a
                onClick={() => {
                  newRequestWebRTCSet({
                    ...newRequestWebRTC,
                    webRTCDataChannel: 'Audio',
                  });
                  setDataTypeDropdownIsActive(false);
                }}
                className="dropdown-item"
              >
                Audio
              </a>
            )}
            {newRequestWebRTC.webRTCDataChannel !== 'Video' && (
              <a
                onClick={() => {
                  newRequestWebRTCSet({
                    ...newRequestWebRTC,
                    webRTCDataChannel: 'Video',
                  });
                  setDataTypeDropdownIsActive(false);
                }}
                className="dropdown-item"
              >
                Video
              </a>
            )}
            {newRequestWebRTC.webRTCDataChannel !== 'Text' && (
              <a
                onClick={() => {
                  newRequestWebRTCSet({
                    ...newRequestWebRTC,
                    webRTCDataChannel: 'Text',
                  });
                  setDataTypeDropdownIsActive(false);
                }}
                className="dropdown-item"
              >
                Text
              </a>
            )}
          </ul>
        </div>
      </div>

      <TextCodeArea
        mode={'application/json'}
        value={newRequestWebRTC.webRTCOffer || ''}
        height={'80px'}
        onChange={(value, viewUpdate) => {
          newRequestWebRTCSet({ ...newRequestWebRTC, webRTCOffer: value });
        }}
        placeholder={'Offer here'}
        readOnly={newRequestWebRTC.webRTCEntryMode === 'WS'}
      />
      <button
        className="button is-normal is-primary-100 add-request-button  no-border-please"
        style={{ margin: '10px' }}
        onClick={createOffer}
      >
        Get Offer
      </button>
      {/* Code box for Answer */}
      <TextCodeArea
        mode={'application/json'}
        value={newRequestWebRTC.webRTCAnswer || ''}
        height={'80px'}
        onChange={(value, viewUpdate) => {
          newRequestWebRTCSet({ ...newRequestWebRTC, webRTCAnswer: value });
        }}
        placeholder={'Answer here'}
        readOnly={newRequestWebRTC.webRTCEntryMode === 'WS'}
      />
      <button
        id="webRTButton"
        className="button is-normal is-primary-100 add-request-button  no-border-please"
        style={{ margin: '10px' }}
        onClick={() => {
          newRequestWebRTCSet({
            ...newRequestWebRTC,
            webRTCAnswer: 'answer generated...',
          });
        }}
      >
        Get Answer
      </button>
      {/* {warningMessage ? <div>{warningMessage.body}</div> : null} */}
    </div>
  );
};

export default WebRTCServerEntryForm;

// const WebRTCServerEntryForm = (props) => {
//   const { warningMessage } = props;
//   const requestBody = useSelector((state) => state.newRequest.newRequestBody);
//   const { bodyIsNew } = requestBody;
//   const [cmValue, setValue] = useState('');

//   const isDark = useSelector((state) => state.ui.isDark);

//   const bodyContent = useSelector(
//     (state) => state.newRequest.newRequestBody.bodyContent
//   );
//   useEffect(() => {
//     if (!bodyIsNew) {
//       /**
//        * @todo This code randomly causes parts of the app to crash. As in, it
//        * will randomly decide to start or stop working without you changing
//        * anything. Need to investigate
//        */
//       setValue(
//         jBeautify(JSON.stringify(bodyContent?.iceConfiguration?.iceServers))
//       );
//     }
//   }, [bodyContent, bodyIsNew]);

//   return (
//     <div className="mt-3">
//       {warningMessage ? <div>{warningMessage.body}</div> : null}
//       <div className="composer-section-title">
//         TURN or STUN Servers (Currently read only)
//       </div>
//       <div className={`${isDark ? 'is-dark-400' : ''} is-neutral-200-box p-3`}>
//         {/*
//          * The WebRTC architecture in Swell does not support updating the STUN/TURN server info
//          * to avoid confusion, we will set the `readonly` flag to `true`
//          */}
//         <CodeMirror
//           value={cmValue}
//           theme={vscodeDark}
//           extensions={[javascript(), EditorView.lineWrapping]}
//           height="100px"
//           readOnly="true"
//         />
//       </div>
//     </div>
//   );
// };

// export default WebRTCServerEntryForm;
