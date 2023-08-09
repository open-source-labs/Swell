import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
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

  const requestBody = useSelector(
    (state: any) => state.newRequest.newRequestBody
  );
  const { bodyIsNew } = requestBody;
  const [cmValue, setValue] = useState<string>('');
  const isDark = useSelector((state: any) => state.ui.isDark);

  const bodyContent = useSelector(
    (state: any) => state.newRequest.newRequestBody.bodyContent
  );
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

  return (
    <div className="mt-3">
      <Select
        className="button is-normal is-primary-100 add-request-button  no-border-please"
        style={{
          width: 'aut',
          marginLeft: '3vw',
          marginTop: '5px',
          marginBottom: '5px',
        }}
        id="method-select"
        // value={http2Method}
        // onChange={handleMethodSelect}
      >
        <MenuItem value="Video">Video</MenuItem>
        <MenuItem value="Audio">Audio</MenuItem>
        <MenuItem value="Text">Text</MenuItem>
      </Select>
      <TextCodeArea
        mode={'application/json'}
        value={newRequestWebRTC.webRTCOffer || ''}
        height={'80px'}
        onChange={(value, viewUpdate) => {
          newRequestWebRTCSet({ ...newRequestWebRTC, webRTCOffer: value });
        }}
        placeholder={'Offer here'}
      />
      <div>
        <button
          className="button is-normal is-primary-100 add-request-button  no-border-please"
          style={{ margin: '10px' }}
          onClick={() => {
            newRequestWebRTCSet({ ...newRequestWebRTC, webRTCOffer: "offer generated..." });
          }}
        >
          Get Offer
        </button>
      </div>
      {/* <div className={`${isDark ? 'is-dark-400' : ''} is-neutral-200-box p-3`}> */}
      {/* Code box for Answer */}
      <TextCodeArea
        mode={'application/json'}
        value={newRequestWebRTC.webRTCAnswer || ''}
        height={'80px'}
        onChange={(value, viewUpdate) => {
          newRequestWebRTCSet({ ...newRequestWebRTC, webRTCAnswer: value });
        }}
        placeholder={'Answer here'}
      />
      {/* <CodeMirror
          value={cmValue}
          theme={vscodeDark}
          extensions={[javascript(), EditorView.lineWrapping]}
          height="100px"
          readOnly={false}
          onChange={(value, viewUpdate) => {
            newRequestWebRTCSet({...newRequestWebRTC, webRTCAnswer: value })
          }}
        /> */}
      {/* </div> */}
      <button
        id="webRTButton"
        className="button is-normal is-primary-100 add-request-button  no-border-please"
        style={{ margin: '10px' }}
        onClick={() => {
          newRequestWebRTCSet({ ...newRequestWebRTC, webRTCAnswer: "answer generated..." });
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
