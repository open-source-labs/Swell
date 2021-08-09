/* eslint-disable react-hooks/exhaustive-deps */
import { use } from 'chai';
import React, { useState, useEffect, useRef } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import Peer from '../../controllers/webrtcPeerController';

const jBeautify = require('js-beautify').js;

export default function WebRTCRequestContent({ content }) {
  console.log('content', content);
  const { body } = content.request;
  const { iceConfiguration } = content.request.body;
  const [connection, setconnection] = useState(null);
  const [channel, setChannel] = useState(null);
  const [localSdp, setLocalSdp] = React.useState('');
  const [remoteSdp, setRemoteSdp] = React.useState('');
  const [pcInitiator, setPcInitiator] = useState(null);

  useEffect(() => {
    console.log(pcInitiator);
    if (pcInitiator) {
      setLocalSdp(pcInitiator.connection.localDescription.sdp);
    }
  }, [pcInitiator]);

  function createLocalSDP() {
    const pc = new Peer(iceConfiguration);
    pc.role = content.request.method;
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
                onClick={() => setRemoteSDP(remoteSdp)}
                className="button is-webrtc"
              >
                Set Remote SDP
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
