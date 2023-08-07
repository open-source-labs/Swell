import {
  reqResUpdated, //understand how these are being used and what is happening to state as it is passed into
  responseDataSaved,
} from '../toolkit-refactor/slices/reqResSlice';
import { appDispatch } from '../toolkit-refactor/store';

// https://ourcodeworld.com/articles/read/1526/how-to-test-online-whether-a-stun-turn-server-is-working-properly-or-not
class Peer {
  config: RTCConfiguration;
  connection: RTCPeerConnection;

  constructor(config: RTCConfiguration, iceServerUrl: string[]) {
    this.config = config;
    this.connection = this.createConnection(iceServerUrl);
    this.connection.onicecandidateerror = (e: Event) => {
      console.error(e);
    };
  }

  createConnection(iceServerUrl: string[]): RTCPeerConnection {
    // createConnection accepts a iceServerUrl with a type of an array of strings, the function is of type RTCPeerConnection (necessary object)
    const iceServers: RTCIceServer[] = iceServerUrl.map((url) => ({
      urls: url,
    })); //const iceServers has a type of RTCIceServer[] mapping every url in the array to the RTCIceServer urls property
    const configuration: RTCConfiguration = {
      iceServers,
    };

    return new RTCPeerConnection(configuration);
  }

  async establishSDP() {
    this.connection.createDataChannel('test');
    this.connection
      .createOffer()
      .then((offer: RTCSessionDescriptionInit) =>
        this.connection.setLocalDescription(offer)
      );
  }

  async establishAnswer(offer: RTCSessionDescriptionInit) {
    const remoteOffer = new RTCSessionDescription(offer);
    await this.connection.setRemoteDescription(remoteOffer);

    const answer = await this.connection.createAnswer();
    await this.connection.setLocalDescription(answer);
  }
}
//replaced with a function that responds with the SDP answer after clicking send
//content should already contain offer/answer string
//inside the function use those strings to create connection
//Answer SDP should be contained in ReqRes obj
// `ReqRes` type need to be fixed consistently across the board
// To make the type for `content` work properly

//Ideally creating the answer here not sure what testSDP connection is testing if there is no generated answer already

export default async function testSDPConnection(content) {
  const { iceConfiguration, offer } = content.request.body;
  // Technically, setting the connection status as 'closed' right away
  // is not entirely accurated. Since we are closing the server a second
  // after it is opened to avoid timeout issue anyway, this is as good
  // as a 'closed' connection.
  // Also, the current setup only works with one iceServer. To expand
  // this feature we need to get the relevant `ReqRes` from `Store.getState()`
  // and add the response there. See `graphQLController.openSubscription()` for example
  const iceServerUrl: string[] = [
    'stun:stun1.1.google.com:19302',
    'stun:stun2.1.google.com:19302',
  ];
  const newReqRes = { ...content, connection: 'closed' };
  const pc = new Peer(iceConfiguration, iceServerUrl);
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
  await pc.establishAnswer(offer); //Generate/set the answer based on the provided offer
  const answer = pc.connection.localDescription; //get the generated answer

  pc.connection.close(); //close the connection
  return answer; //Return the SDP answer => send to the UI to be displayed
}

