import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { useSelector, useDispatch } from 'react-redux';
import Peer from '../../../controllers/webrtcPeerController';
import { json } from '@codemirror/lang-json';
import { EditorView } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { matchBrackets } from '@codemirror/language';
import { responseDataSaved } from '../../../toolkit-refactor/reqRes/reqResSlice';

const jBeautify = require('js-beautify').js;

export default function WebRTCRequestContent({ content }) {
  const { iceConfiguration } = content.request.body;
  const [localSdp, setLocalSdp] = useState('');
  const [pcInitiator, setPcInitiator] = useState(null);

  const dispatch = useDispatch();
  const currentResponse = useSelector((store) => store.reqRes.currentResponse);

  useEffect(() => {
    if (pcInitiator?.connection?.localDescription) {
      dispatch(
        responseDataSaved({
          ...content,
          webrtcData: {
            localSdp: pcInitiator.connection.localDescription.sdp,
          },
        })
      );
    }
  }, [pcInitiator, localSdp, dispatch, content]);

  useEffect(() => {
    setLocalSdp(currentResponse?.webrtcData?.localSdp);
  }, [currentResponse]);

  function createLocalSDP() {
    const peerConnection = new Peer(iceConfiguration);
    peerConnection.role = 'INITIATOR';
    peerConnection.initDataChannelAndEvents();
    peerConnection.createLocalSdp();
    setPcInitiator(peerConnection);
  }

  return (
    <div>
      <div className="p-3">
        <div className="is-size-7">Servers</div>
        <CodeMirror
          value={jBeautify(JSON.stringify(iceConfiguration.iceServers))}
          theme="dark"
          readOnly="true"
          extensions={[javascript(), EditorView.lineWrapping]}
          height="100%"
          width="100%"
          maxWidth="400px"
          maxHeight="300px"
        />
      </div>
      <div className="p-3">
        <div className="is-size-7">Local SDP</div>
        <div
          style={{ maxWidth: `100%`, maxHeight: '100%' }}
          className="column is-flex is-flex-direction-column"
        >
          <CodeMirror
            value={localSdp || 'No SDP yet'}
            extensions={[json()]}
            theme="dark"
            readOnly="true"
            height="100%"
            width="100%"
            maxWidth="400px"
            maxHeight="300px"
          />
          <button className="button is-webrtc" onClick={() => createLocalSDP()}>
            Create Local SDP
          </button>
        </div>
      </div>
    </div>
  );
}
