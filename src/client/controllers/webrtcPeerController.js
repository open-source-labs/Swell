/**
 * exports Peer class for use in WebRTC implementations
 *
 * @file   webrtcPeerController.js
 * @author Ted Craig
 * @since  1.0.0
 */

export default class Peer {
  //  ┌──────────────────────────────┐
  //  │        CONSTRUCTOR              │
  //  └──────────────────────────────┘
  constructor(initConfig) {
    this.initConfig = initConfig;
    this._roles = {
      INITIATOR: 'INITIATOR',
      PENDING: 'PENDING',
      RECEIVER: 'RECEIVER',
    };
    this.role = this._roles.PENDING;
    this._createPeer(initConfig);
    this._initICECandidateEvents();
  }

  //  ┌──────────────────────────────┐
  //  │      GET BROWSER RTC            │
  //  └──────────────────────────────┘

  getBrowserRTC() {
    if (typeof globalThis === 'undefined') return null;
    const wrtc = {
      RTCPeerConnection:
        globalThis.RTCPeerConnection ||
        globalThis.mozRTCPeerConnection ||
        globalThis.webkitRTCPeerConnection,
      RTCSessionDescription:
        globalThis.RTCSessionDescription ||
        globalThis.mozRTCSessionDescription ||
        globalThis.webkitRTCSessionDescription,
      RTCIceCandidate:
        globalThis.RTCIceCandidate ||
        globalThis.mozRTCIceCandidate ||
        globalThis.webkitRTCIceCandidate,
    };
    if (!wrtc.RTCPeerConnection) return null;
    return wrtc;
  }

  //  ┌──────────────────────────────┐
  //  │          _ CREATE PEER          │
  //  └──────────────────────────────┘
  _createPeer(config) {
    // grab RTCPeerConnection from globalThis
    // console.log('[webrtcPeerController][Peer][_createPeer] getBrowserRTC():');
    // console.log(this.getBrowserRTC());
    const Wrtc = this.getBrowserRTC();

    // instantiate a new peer connection with config and return
    this.connection = new Wrtc.RTCPeerConnection(config);
  }

  //  ┌──────────────────────────────┐
  //  │    _ INIT ICE CANDIDATE EVENTS  │
  //  └──────────────────────────────┘
  _initICECandidateEvents() {
    // setup ice candidate event handler
    // listen for ICE candidates.  Each time a candidate is added to the list, re-log the whole SDP
    // this.connection.onicecandidate = (event) => {
    //   if (
    //     event &&
    //     event.target &&
    //     event.target.iceGatheringState === 'complete'
    //   ) {
    //     console.log(
    //       'done gathering candidates - got iceGatheringState complete'
    //     );
    //   } else if (event && event.candidate == null) {
    //     console.log('done gathering candidates - got null candidate');
    //   } else {
    //     console.log(
    //       event.target.iceGatheringState,
    //       event,
    //       this.connection.localDescription
    //     );
    //     // console.log('corresponding SDP for above ICE candidate in JSON:');
    //     // console.log(JSON.stringify(this.connection.localDescription));
    //   }
    // };
  }

  //  ┌──────────────────────────────┐
  //  │   INIT DATA CHANNEL AND EVENTS  │
  //  └──────────────────────────────┘
  initDataChannelAndEvents() {
    // check for role before continuing
    if (this.role === this._roles.PENDING) {
      console.log(`peer role is ${this.role}. Skipping channel init.`);
    } else if (this.role === this._roles.INITIATOR) {
      // on our local connection, create a data channel and pass it the name "chatRoom1"
      const dataChannel = this.connection.createDataChannel('chatRoom1');

      // when the channel is opened ...
      dataChannel.onopen = (event) => console.log('Connection opened!');

      // when the channel is closed ...
      dataChannel.onclose = (event) =>
        console.log('Connection closed! Goodbye (^-^)');

      // when message received...
      dataChannel.onmessage = (event) =>
        console.log('Received Msg: ' + event.data);
    } else if (this.role === this._roles.RECEIVER) {
      this.connection.ondatachannel = (event) => {
        // create new property on rc object and assign it to be the incoming data channel (*** is this the name that was passed in by the local client? ***)
        const incomingChannel = event.channel;
        this.connection.dataChannel = incomingChannel;
        // when the channel is opened ...
        //remoteConnection.dataChannel.onopen = event => console.log("Connection opened!");
        this.connection.dataChannel.onopen = (event) =>
          console.log('Connection opened!');
        // when the channel is closed ...
        //remoteConnection.dataChannel.onclose = event => console.log("Connection closed! Goodbye (^-^)");
        this.connection.dataChannel.onclose = (event) =>
          console.log('Connection closed! Goodbye (^-^)');
        // when message received...
        //remoteConnection.dataChannel.onmessage = event => console.log("PeerA: " + event.data);
        this.connection.dataChannel.onmessage = (event) =>
          console.log('Received Msg' + event.data);
      };
    }
  }

  //  ┌──────────────────────────────┐
  //  │        CREATE LOCAL SDP         │
  //  └──────────────────────────────┘
  createLocalSdp() {
    if (this.role === this._roles.PENDING) this.role = this._roles.INITIATOR;

    if (this.role === this._roles.INITIATOR) {
      this.connection
        .createOffer()
        .then((offer) => this.connection.setLocalDescription(offer))
        .then((a) => {
          console.log('offer set successfully!');
          // return the offer/localDescription
          return this.connection.localDescription;
        })
        .catch(
          `[webrtcPeerController][createLocalSdp] ERROR while attempting to set offer`
        );
    }
  }
}
