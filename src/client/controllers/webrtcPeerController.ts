import { WRTC } from '../../types';
/**
 * exports Peer class for use in WebRTC implementations
 *
 * @file   webrtcPeerController.js
 * @author Ted Craig
 * @since  1.0.0
 */

export default class Peer {
  //  ┌──────────────────────────────┐
  //  │        CONSTRUCTOR           │
  //  └──────────────────────────────┘
  initConfig: RTCConfiguration;

  _roles: Record<string, string>;

  role: string;
  
  constructor(initConfig: RTCConfiguration) {
    this.initConfig = initConfig;
    this._roles = {
      INITIATOR: 'INITIATOR',
      PENDING: 'PENDING',
      RECEIVER: 'RECEIVER',
    };
    this.role = 'PENDING';
    this._createPeer(initConfig);
    this._initICECandidateEvents();
    // this.connection = connection;
  }

  //  ┌──────────────────────────────┐
  //  │       GET BROWSER RTC        │
  //  └──────────────────────────────┘

  getBrowserRTC(): null | Record<number, WRTC> { //-> we are pretty sure that this is not the correct type, but it works, so...
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
    // console.log(wrtc);
    return wrtc;
  }

  //  ┌──────────────────────────────┐
  //  │       _ CREATE PEER          │
  //  └──────────────────────────────┘
  _createPeer(config: RTCConfiguration): void {
    // grab RTCPeerConnection from globalThis
    // console.log('[webrtcPeerController][Peer][_createPeer] getBrowserRTC():');
    // console.log(this.getBrowserRTC());
    const Wrtc = this.getBrowserRTC();

    // instantiate a new peer connection with config and return
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'connection' does not exist on type 'Peer... Remove this comment to see the full error message
    this.connection = new Wrtc.RTCPeerConnection(config);
  }

  //  ┌──────────────────────────────┐
  //  │ _ INIT ICE CANDIDATE EVENTS  │
  //  └──────────────────────────────┘
  _initICECandidateEvents(): void {
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
  //  │ INIT DATA CHANNEL AND EVENTS │
  //  └──────────────────────────────┘
  initDataChannelAndEvents(): void {
    // check for role before continuing
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'role' does not exist on type 'Peer'.
    if (this.role === this._roles.PENDING) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'role' does not exist on type 'Peer'.
      console.log(`peer role is ${this.role}. Skipping channel init.`);
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'role' does not exist on type 'Peer'.
    } else if (this.role === this._roles.INITIATOR) {
      // on our local connection, create a data channel and pass it the name "chatRoom1"
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'connection' does not exist on type 'Peer... Remove this comment to see the full error message
      const dataChannel = this.connection.createDataChannel('chatRoom1');

      // when the channel is opened ...
      dataChannel.onopen = (event: any) => console.log('Connection opened!');

      // when the channel is closed ...
      dataChannel.onclose = (event: any) => console.log('Connection closed! Goodbye (^-^)');

      // when message received...
      dataChannel.onmessage = (event: any) => console.log('Received Msg: ' + event.data);
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'role' does not exist on type 'Peer'.
    } else if (this.role === this._roles.RECEIVER) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'connection' does not exist on type 'Peer... Remove this comment to see the full error message
      this.connection.ondatachannel = (event: any) => {
        // create new property on rc object and assign it to be the incoming data channel (*** is this the name that was passed in by the local client? ***)
        const incomingChannel = event.channel;
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'connection' does not exist on type 'Peer... Remove this comment to see the full error message
        this.connection.dataChannel = incomingChannel;
        // when the channel is opened ...
        //remoteConnection.dataChannel.onopen = event => console.log("Connection opened!");
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'connection' does not exist on type 'Peer... Remove this comment to see the full error message
        this.connection.dataChannel.onopen = (event: any) => console.log('Connection opened!');
        // when the channel is closed ...
        //remoteConnection.dataChannel.onclose = event => console.log("Connection closed! Goodbye (^-^)");
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'connection' does not exist on type 'Peer... Remove this comment to see the full error message
        this.connection.dataChannel.onclose = (event: any) => console.log('Connection closed! Goodbye (^-^)');
        // when message received...
        //remoteConnection.dataChannel.onmessage = event => console.log("PeerA: " + event.data);
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'connection' does not exist on type 'Peer... Remove this comment to see the full error message
        this.connection.dataChannel.onmessage = (event: any) => console.log('Received Msg' + event.data);
      };
    }
  }

  //  ┌──────────────────────────────┐
  //  │       CREATE LOCAL SDP       │
  //  └──────────────────────────────┘
  createLocalSdp() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'role' does not exist on type 'Peer'.
    if (this.role === this._roles.PENDING) this.role = this._roles.INITIATOR;

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'role' does not exist on type 'Peer'.
    if (this.role === this._roles.INITIATOR) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'connection' does not exist on type 'Peer... Remove this comment to see the full error message
      this.connection
        .createOffer()
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'connection' does not exist on type 'Peer... Remove this comment to see the full error message
        .then((offer: any) => this.connection.setLocalDescription(offer))
        .then((a: any) => {
          console.log('offer set successfully!');
          // return the offer/localDescription
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'connection' does not exist on type 'Peer... Remove this comment to see the full error message
          return this.connection.localDescription;
        })
        .catch(
          `[webrtcPeerController][createLocalSdp] ERROR while attempting to set offer`
        );
    }
  }
}
