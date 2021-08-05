import React from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';

//you can specify a STUN server here
const iceConfiguration = {};
iceConfiguration.iceServers = [];
//turn server
iceConfiguration.iceServers.push({
  // new coturn STUN/TURN
  urls: 'turn:104.153.154.109',
  username: 'teamswell',
  credential: 'cohortla44',
  credentialType: 'password',
});
//stun  server
iceConfiguration.iceServers.push(
  {
    urls: 'stun:stun1.l.google.com:19302',
  },
  {
    urls: 'stun:104.153.154.109',
  }
);
// create local connection as instance of RTCPeerConnection
const localConnection = new RTCPeerConnection(iceConfiguration);

// listen for ICE candiates.  Each time a candidate is added to the list, re-log the whole SDP
let localSdp = '';
localConnection.onicecandidate = (event) => {
  if (event && event.target && event.target.iceGatheringState === 'complete') {
    console.log('done gathering candidates - got iceGatheringState complete');
  } else if (event && event.candidate == null) {
    console.log('done gathering candidates - got null candidate');
  } else {
    console.log(
      event.target.iceGatheringState,
      event,
      localConnection.localDescription
    );
    console.log('corresponding SDP for above ICE candidate in JSON:');
    // console.log(JSON.stringify(localConnection.localDescription));
    localSdp = JSON.stringify(localConnection.localDescription);
    console.log(localSdp);
  }
};
// on our local connection, create a data channel and pass it the name "chatRoom1"
const dataChannel = localConnection.createDataChannel('chatRoom1');
// when the channel is openned ...
dataChannel.onopen = (event) => console.log('Connection opened!');
// when the channel is closed ...
dataChannel.onclose = (event) =>
  console.log('Connection closed! Goodbye (^-^)');
// when message received...
dataChannel.onmessage = (event) => console.log('PeerB: ' + event.data);
localConnection
  .createOffer()
  .then((offer) => localConnection.setLocalDescription(offer))
  .then((a) => console.log('offer set successfully!'));

export default function WebRTCRequestContent({ content }) {
  const [remoteSdp, setRemoteSdp] = React.useState('');
  console.log(`content`, content);
  console.log(`request`, content.request);
  console.log(`webrtc data`, content.webrtcData);
  const { body } = content.request;

  console.log(remoteSdp);

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
              <button className="button is-webrtc">Set Local SDP</button>
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
