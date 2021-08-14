import React, { useState, useEffect } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import { useSelector, useDispatch } from 'react-redux';
import Peer from '../../controllers/webrtcPeerController';
import * as actions from '../../actions/actions.js';
import { invite, handleSendButton } from '../../controllers/webrtcController';

const jBeautify = require('js-beautify').js;

export default function WebRTCRequestContent({ content }) {
  const { body } = content.request;
  const { iceConfiguration } = content.request.body;
  const [localSdp, setLocalSdp] = useState('');
  const [remoteSdp, setRemoteSdp] = useState('');
  const [pcInitiator, setPcInitiator] = useState(null);
  const dispatch = useDispatch();

  const newRequestFields = useSelector(
    (store) => store.business.newRequestFields
  );
  const currentResponse = useSelector(
    (store) => store.business.currentResponse
  );

  useEffect(() => {
    if (pcInitiator?.connection?.localDescription) {
      setLocalSdp(pcInitiator.connection.localDescription.sdp);
      // const requestFieldObj = {
      //   ...content,
      //   webrtcData: {
      //     localSdp,
      //   },
      // };
      // dispatch(actions.setNewRequestFields(requestFieldObj));
      // dispatch(actions.saveCurrentResponseData(requestFieldObj));
    }
  }, [pcInitiator, localSdp, content]);

  function createLocalSDP() {
    const pc = new Peer(iceConfiguration);
    pc.role = content.request.method;
    pc.initDataChannelAndEvents();
    pc.createLocalSdp();
    setPcInitiator(pc);
  }

  function handleClick(e) {
    invite(e, iceConfiguration);
    // handleSendButton();
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
      <div className="columns p-3">
        <div className="column is-flex is-half is-flex-direction-column">
          <div className="is-size-7">Local SDP</div>
          <div className="columns">
            <div
              style={{ maxWidth: `100%`, height: '100%' }}
              className="column is-flex is-flex-direction-column"
            >
              <CodeMirror
                value={localSdp || 'No SDP yet'}
                options={{
                  mode: 'application/json',
                  theme: 'neo readonly',
                  lineNumbers: true,
                  tabSize: 4,
                  lineWrapping: true,
                  readOnly: true,
                }}
              />
              <button
                className="button is-webrtc"
                onClick={() => createLocalSDP()}
              >
                Create Local SDP
              </button>
            </div>
          </div>
        </div>
        <div className="column is-half is-flex is-flex-direction-column">
          <div className="is-size-7">Remote SDP</div>
          <div className="columns">
            <div className="column is-flex is-flex-direction-column">
              <CodeMirror
                value={remoteSdp || 'No SDP yet'}
                // onChange={setRemoteSDP}
                options={{
                  mode: 'application/json',
                  theme: 'neo readonly',
                  lineNumbers: true,
                  tabSize: 4,
                  lineWrapping: true,
                  readOnly: false,
                }}
              />
              <button
                // onClick={() => setRemoteSDP(remoteSdp)}
                onClick={(e) => {
                  handleClick(e);
                }}
                className="button is-webrtc"
              >
                Invite
              </button>
              <button
                // onClick={() => setRemoteSDP(remoteSdp)}
                onClick={handleSendButton}
                className="button is-webrtc"
              >
                Send message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
