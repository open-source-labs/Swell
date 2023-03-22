import {
  reqResUpdated,
  responseDataSaved,
} from '../toolkit-refactor/reqRes/reqResSlice';
import { appDispatch } from '../toolkit-refactor/store';

// https://ourcodeworld.com/articles/read/1526/how-to-test-online-whether-a-stun-turn-server-is-working-properly-or-not
class Peer {
  config: RTCConfiguration;
  connection: RTCPeerConnection;

  constructor(config: RTCConfiguration) {
    this.config = config;
    this.connection = this.createConnection();
    this.connection.onicecandidateerror = (e: Event) => {
      console.error(e);
    };
  }

  createConnection(): RTCPeerConnection {
    return new RTCPeerConnection(this.config);
  }

  async establishSDP() {
    this.connection.createDataChannel('test');
    this.connection
      .createOffer()
      .then((offer: RTCSessionDescriptionInit) =>
        this.connection.setLocalDescription(offer)
      );
  }
}

// `ReqRes` type need to be fixed consistently across the board
// To make the type for `content` work properly
export default async function testSDPConnection(content) {
  const { iceConfiguration } = content.request.body;
  // Technically, setting the connection status as 'closed' right away
  // is not entirely accurated. Since we are closing the server a second
  // after it is opened to avoid timeout issue anyway, this is as good
  // as a 'closed' connection.
  // Also, the current setup only works with one iceServer. To expand
  // this feature we need to get the relevant `ReqRes` from `Store.getState()`
  // and add the response there. See `graphQLController.openSubscription()` for example
  const newReqRes = { ...content, connection: 'closed' };
  const pc = new Peer(iceConfiguration);
  pc.connection.onicecandidate = (e) => {
    if (!e.candidate) return;

    const { type, address } = e.candidate;
    if (type === 'srflx') {
      newReqRes.response = {
        ...newReqRes.response,
        events: [
          ...newReqRes.response.events,
          {
            serverType: 'STUN',
            publicIpAddress: address,
            eventCandidate: e.candidate,
          },
        ],
      };
      appDispatch(responseDataSaved(newReqRes));
      appDispatch(reqResUpdated(newReqRes));
      console.log('STUN Server is reachable!');
      console.log('Public IP Address: ', address);
    }

    if (type === 'relay') {
      newReqRes.response = {
        ...newReqRes.response,
        events: [
          ...newReqRes.response.events,
          {
            serverType: 'TURN',
            publicIpAddress: address,
            eventCandidate: e.candidate,
          },
        ],
      };
      appDispatch(responseDataSaved(newReqRes));
      appDispatch(reqResUpdated(newReqRes));
      console.log('TURN Server is reachable!');
    }
  };
  pc.establishSDP();
  setTimeout(() => {
    pc.connection.close();
    console.log('WebRTC connection closed.');
  }, 1000);
}

