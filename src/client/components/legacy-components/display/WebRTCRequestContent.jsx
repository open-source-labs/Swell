import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { useSelector, useDispatch } from 'react-redux';
import Peer from '../../../controllers/webrtcPeerController';
import { json } from '@codemirror/lang-json';
import { EditorView } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { matchBrackets } from '@codemirror/language';

/**@todo delete when slice conversion complete */
import * as actions from '../../../features/business/businessSlice';
//import * as uiactions from '../../../features/ui/uiSlice';

import { responseDataSaved } from '../../../toolkit-refactor/reqRes/reqResSlice';

const jBeautify = require('js-beautify').js;

export default function WebRTCRequestContent({ content }) {
  const { body } = content.request;
  const { iceConfiguration } = content.request.body;
  const [localSdp, setLocalSdp] = useState('');
  const [pcInitiator, setPcInitiator] = useState(null);

  const dispatch = useDispatch();

  const currentResponse = useSelector(
    (store) => store.business.currentResponse
  );

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
    const pc = new Peer(iceConfiguration);
    pc.role = 'INITIATOR';
    pc.initDataChannelAndEvents();
    pc.createLocalSdp();
    setPcInitiator(pc);
  }

  return (
    <div>
      <div className="p-3">
        <div className="is-size-7">Servers</div>
        <CodeMirror
          value={jBeautify(JSON.stringify(body.iceConfiguration.iceServers))}
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
