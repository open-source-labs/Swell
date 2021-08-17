import React, { useState, useEffect } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import { useSelector, useDispatch } from 'react-redux';
import Peer from '../../controllers/webrtcPeerController';
import * as actions from '../../actions/actions.js';

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
        actions.saveCurrentResponseData({
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
          options={{
            mode: 'javascript',
            theme: 'neo sidebar',
            scrollbarStyle: 'native',
            lineNumbers: true,
            lint: true,
            hintOptions: true,
            matchBrackets: true,
            autoCloseBrackets: true,
            indentUnit: 1,
            tabSize: 1,
          }}
          editorDidMount={(editor) => {
            editor.setSize('100%', '100%');
          }}
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
            options={{
              mode: 'application/json',
              theme: 'neo readonly',
              lineNumbers: true,
              tabSize: 4,
              scrollbarStyle: 'native',
              lineWrapping: true,
              readOnly: true,
            }}
          />
          <button className="button is-webrtc" onClick={() => createLocalSDP()}>
            Create Local SDP
          </button>
        </div>
      </div>
    </div>
  );
}
