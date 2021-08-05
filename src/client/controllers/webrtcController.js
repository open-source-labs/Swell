/* eslint-disable camelcase */
import * as store from '../store';
import * as actions from '../actions/actions';

const { api } = window;

// define roles
const roles = {
  pending: 'PENDING',
  initiator: 'INITIATOR',
  receiver: 'RECEIVER',
};

// set my role
const myRole = roles.pending;

// Server configuration
const iceConfiguration = {};
iceConfiguration.iceServers = [];

// turn server
iceConfiguration.iceServers.push({
  // new coturn STUN/TURN
  urls: 'turn:104.153.154.109',
  username: 'teamswell',
  credential: 'cohortla44',
  credentialType: 'password',
});

iceConfiguration.iceServers.push(
  {
    urls: 'stun:stun1.l.google.com:19302',
  },
  {
    urls: 'stun:104.153.154.109',
  }
);

const webrtcController = {
  openWebrtcConnection(reqResObj, connectionArray) {
    console.log(`webrtcController.openWebrtcConnection`);
    // set reqResObj for webrtc
    reqResObj.response.messages = [];
    reqResObj.request.messages = [];
    reqResObj.connection = 'pending';
    reqResObj.closeCode = 0;
    reqResObj.timeSent = Date.now();

    // create peer connections as instances of RTCPeerConnection
    const pcInitiator = new RTCPeerConnection(iceConfiguration);
    const pcReceiver = new RTCPeerConnection(iceConfiguration);

    // store.default.dispatch(actions.reqResUpdate(reqResObj));
    console.log(`connection array`, connectionArray);
    console.log(`reqResObj`, reqResObj);

    console.log(pcInitiator);

    pcInitiator.onicecandidate = (event) => displayLocalSDP(event);
    pcReceiver.onicecandidate = (event) => displayLocalSDP(event);

    // log and display Local SDP (ICE candidates)
    function displayLocalSDP(event) {
      console.log(`displayLocalSDP: incoming event:`);
      console.log(event);

      if (
        event &&
        event.target &&
        event.target.iceGatheringState === 'complete'
      ) {
        console.log(
          'done gathering candidates - got iceGatheringState complete'
        );
      } else if (event && event.candidate == null) {
        console.log('done gathering candidates - got null candidate');
      } else {
        console.log(
          event.target.iceGatheringState,
          event,
          event.target.localDescription
        );
        console.log('corresponding SDP for above ICE candidate in JSON:');
        console.log(JSON.stringify(event.target.localDescription));
        // display the newly created SDP in the Local SDP textarea on the DOM
        const localSDP = JSON.stringify(event.target.localDescription);
        localSdpDisplay.textContent = localSDP; // DOM element
      }
    }
  },
};

export default webrtcController;
