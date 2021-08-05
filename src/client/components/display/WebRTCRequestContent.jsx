import React from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import webrtcController from '../../controllers/webrtcController';

export default function WebRTCRequestContent({ content }) {
  console.log(`content`, content);
  console.log(`request`, content.request);
  console.log(`webrtc data`, content.webrtcData);
  const { body } = content.request;
  return (
    <div>
      <div className="p-3">
        <div>
          <div className="is-size-7">Servers</div>
          <CodeMirror
            value={body}
            options={{
              mode: 'application/json',
              theme: 'neo readonly',
              lineNumbers: true,
              tabSize: 4,
              lineWrapping: true,
              readOnly: true,
            }}
          />
        </div>
      </div>
      <div className="columns p-3">
        <div className="column">
          <div className="is-size-7">Local SDP</div>
          <div className="columns">
            <div className="column">
              <CodeMirror
                value={body}
                options={{
                  mode: 'application/json',
                  theme: 'neo readonly',
                  lineNumbers: true,
                  tabSize: 4,
                  lineWrapping: true,
                  readOnly: true,
                }}
              />
              <div className="is-flex-direction-row is-justify-content-center">
                <button
                  className="button is-webrtc"
                  onClick={() => webrtcController.setLocalSDP(content)}
                >
                  Set Local SDP
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="column">
          <div className="is-size-7">Remote SDP</div>
          <CodeMirror
            value={body}
            options={{
              mode: 'application/json',
              theme: 'neo readonly',
              lineNumbers: true,
              tabSize: 4,
              lineWrapping: true,
              readOnly: true,
            }}
          />
          <button className="button is-webrtc">Set Remote SDP</button>
        </div>
      </div>
    </div>
  );
}
