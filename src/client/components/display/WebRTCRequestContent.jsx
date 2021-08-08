import React from 'react';
import { useState } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import Peer from '../../controllers/webrtcPeerController'


// Clearly this should be wired into actual Redux store
// if we start really wiring up webrtc functionality
// localSdp = '';


// //you can specify a STUN server here
const iceConfiguration = {};
iceConfiguration.iceServers = [
  {
    // new coturn STUN/TURN
    urls: 'turn:104.153.154.109',
    username: 'teamswell',
    credential: 'cohortla44',
    credentialType: 'password',
  },
  {
    urls: 'stun:104.153.154.109',
  },
  {
    urls: 'stun:stun1.l.google.com:19302',
  },
];



export default function WebRTCRequestContent({ content }) {
  // Clearly this should be wired into actual Redux store
  // if we start really wiring up webrtc functionality
  const [localSdp, setLocalSdp] = React.useState('');
  const [remoteSdp, setRemoteSdp] = React.useState('');
  
  console.log(`content`, content);
  console.log(`request`, content.request);
  console.log(`webrtc data`, content.webrtcData);
  const { body } = content.request;

  console.log(remoteSdp);

  function createLocalSDP(config){
    // add pcInitiator to global properties and instantiate a new Peer
    let configuration = {};
    // ***** Having trouble with JSON object coversion from "body"
    // ***** when added to configuration and passed into Peer,
    // ***** we get ERROR: Failed to construct 'RTCPeerConnection': cannot convert to dictionary.
    // ***** so skipping this for the commmit
    //
    // if (config) {
    //   console.log('server info from UI:');
    //   console.log(config);
    //   configuration.iceServers = [...config];
    //   console.log('configuration set via UI:');
    //   console.log(configuration);
    // } else {
    //   configuration = iceConfiguration;
    // }
    configuration = iceConfiguration;
    globalThis.pcInitiator = new Peer(configuration);
    pcInitiator.role = pcInitiator._roles.INITIATOR;
    pcInitiator.initDataChannelAndEvents();
    console.log('[WebRTCRequestContent][createLocalSdp] pcInitiator.createLocalSdp()');
    // createLocalSdp now returns the localDescription once the offer is gereated and set
    // so assign that to localSDP
    return pcInitiator.createLocalSdp();
  }

  function setRemoteSDP(data) {
    // console.log(e);
    console.log('setRemoteSDP', data);

    // setRemoteSdp(data);
  }

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
        <div className="column is-flex is-half is-flex-direction-column">
          <div className="is-size-7">Local SDP</div>
          <div className="columns">
            <div
              style={{ maxWidth: `100%` }}
              className="column is-flex is-flex-direction-column"
            >
              <CodeMirror
                value={localSdp || 'No SDP yet'} // this is not updated when the value in local state changes.  Should prob be added to Redux store, anyway.
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
                onClick={() => setLocalSdp( createLocalSDP( body))}
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
                onChange={setRemoteSDP}
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
