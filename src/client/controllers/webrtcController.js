/* eslint-disable camelcase */
import * as store from '../store';
import * as actions from '../actions/actions';

const { api } = window;

function doWebrtcShit(){

  // get-browser-rtc
  //
  function getBrowserRTC () {
    if (typeof globalThis === 'undefined') return null
    const wrtc = {
      RTCPeerConnection: globalThis.RTCPeerConnection || globalThis.mozRTCPeerConnection ||
        globalThis.webkitRTCPeerConnection,
      RTCSessionDescription: globalThis.RTCSessionDescription ||
        globalThis.mozRTCSessionDescription || globalThis.webkitRTCSessionDescription,
      RTCIceCandidate: globalThis.RTCIceCandidate || globalThis.mozRTCIceCandidate ||
        globalThis.webkitRTCIceCandidate
    }
    if (!wrtc.RTCPeerConnection) return null
    return wrtc
  }

  const wrtc = getBrowserRTC();

  console.log('webrtcController: wrtc')
  console.log(wrtc);

  // define roles
  const roles = {
    pending: 'PENDING',
    initiator: 'INITIATOR',
    receiver: 'RECEIVER',
  };

  // set my role
  const myRole = roles.pending;

  // decalre localSDP -- this will go into state in a 'real' implementation
  let localSdp;


  // Server configuration
  const iceConfiguration = {};
  iceConfiguration.iceServers = [
    {
      urls: 'turn:104.153.154.109',
      username: 'teamswell',
      credential: 'cohortla44',
      credentialType: 'password',
    },
    {
      urls: 'stun:stun1.l.google.com:19302',
    },
    {
      urls: 'stun:104.153.154.109',
    },
  ];

  const pcInitiator = new wrtc.RTCPeerConnection(iceConfiguration);
  const pcReceiver = new wrtc.RTCPeerConnection(iceConfiguration);

  // listen for ICE candiates.  Each time a candidate is added to the list, re-log the whole SDP
  pcInitiator.onicecandidate = event => { 
      if (event && event.target && event.target.iceGatheringState === 'complete') {
          console.log('done gathering candidates - got iceGatheringState complete');
      } else if (event && event.candidate == null) {
          console.log('done gathering candidates - got null candidate');
      } else {
          console.log(event.target.iceGatheringState, event, localConnection.localDescription);
          console.log("corresponding SDP for above ICE candidate in JSON:");
          console.log(JSON.stringify(localConnection.localDescription));
      }
  }

  //pcReceiver.onicecandidate = event => displayLocalSDP(event);

  // listen for signaling status state changes
  pcInitiator.onsignalingstatechange = event => console.log('onsignalingstatechange\n',event);
  // pcReceiver.onsignalingstatechange = event => updateSignalingStateDisplay(event);

  // listen for ice connection state changes
  pcInitiator.iceconnectionstatechange = event => console.log('iceconnectionstatechange\n',event);
  // pcReceiver.iceconnectionstatechange = event => {
  //   console.log('*** iceconnectionstatechange');
  //   updateIceTimelineDisplay(event);
  // }

  // listen for connection state changes
  pcInitiator.onconnectionstatechange = event => console.log('onconnectionstatechange\n',event);
  //pcReceiver.onconnectionstatechange = event => updateConnectionTimelineDisplay(event);


  function setLocalSDP(content){
    console.log('setLocalSDP');
    console.log('[setLocalSDP] pcInitiator config:');
    console.log(JSON.stringify(pcInitiator.getConfiguration()));
    //console.log(content.webrtcData);
    pcInitiator
      .createOffer()
      .then((offer) => {
        pcInitiator.setLocalDescription(offer);
      })
      .then((a) => {
        console.log('[setLocalSDP] offer set successfully!');
        localSdp = JSON.stringify(
          pcInitiator.localDescription
        );
        console.log(
          '[setLocalSDP] localSdp: (stringified)\n',
          JSON.stringify(localSdp)
        );
        // store.default.dispatch(actions.saveCurrentResponseData(content));
        // store.default.dispatch(actions.reqResUpdate(newReqRes));
      });
    pcInitiator.onicecandidate = (event) => console.log(event);
  }

} // end of doWebrtcShit()

const webrtcController = {
  openWebrtcConnection(reqResObj, connectionArray) {
    console.log(`webrtcController.openWebrtcConnection`);

    // set reqResObj for webrtc
    reqResObj.response.messages = [];
    reqResObj.request.messages = [];
    reqResObj.connection = 'pending';
    reqResObj.closeCode = 0;
    reqResObj.timeSent = Date.now();

    reqResObj.connection = 'connected';
    //console.log(pcInitiator);
    
    doWebrtcShit();
  },


  displayLocalSDP(event) {
    // console.log('new ICE candidate:\n', event.target.localDescription);
  },
};

export default webrtcController;
