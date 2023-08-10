import { appDispatch } from '../toolkit-refactor/store';
import {
  newRequestWebRTCSet,
  newRequestWebRTCOfferSet,
} from '../toolkit-refactor/slices/newRequestSlice';

import Store from '../toolkit-refactor/store';
import { RequestWebRTC } from '../../types';

// THIS IS WHAT REQUESTWEBRTC LOOKS LIKE
// export interface RequestWebRTC {
//   webRTCEntryMode: 'Manual' | 'WS';
//   webRTCDataChannel: 'Audio' | 'Video' | 'Text';
//   webRTCWebsocketServer: string | null;
//   webRTCOffer: string | null;
//   webRTCAnswer: string | null;
//   webRTCpeerConnection: RTCPeerConnection | null;
// webRTCLocalStream: null,
// webRTCRemoteStream: null,
// }

const webrtcPeerController = {
  createPeerConnection: async (
    newRequestWebRTC: RequestWebRTC
  ): Promise<void> => {
    let servers = {
      iceServers: [
        {
          urls: [
            'stun:stun1.1.google.com:19302',
            'stun:stun2.1.google.com:19302',
          ],
        },
      ],
    };
    //   type VideoProps = VideoHTMLAttributes<HTMLVideoElement> & {
    //   srcObject: MediaStream;
    // };

    // export const Video = ({ srcObject, ...props }: VideoProps) => {
    //   const refVideo = useCallback(
    //     (node: HTMLVideoElement) => {
    //       if (node) node.srcObject = srcObject;
    //     },
    //     [srcObject],
    //   );

    //   return <video ref={refVideo} {...props} />;
    // };

    if (newRequestWebRTC.webRTCDataChannel === 'Video') {
      let peerConnection = new RTCPeerConnection(servers);

      // set localStream to user's camera stream
      let localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      document.getElementById('user-1')!.srcObject = localStream;

      // function is invoked when track is received on localStream
      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
      });
      -0;

      let remoteStream = new MediaStream();
      peerConnection.ontrack = async (event) => {
        event.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track);
        });
      };

      appDispatch(
        newRequestWebRTCSet({
          ...newRequestWebRTC,
          webRTCpeerConnection: peerConnection,
          webRTCLocalStream: localStream,
          webRTCRemoteStream: remoteStream,
        })
      );

      peerConnection.onicecandidate = async (
        event: RTCPeerConnectionIceEvent
      ): Promise<void> => {
        if (event.candidate) {
          //appDispatch storing in state the updated copy of state
          appDispatch(
            newRequestWebRTCOfferSet(
              JSON.stringify(peerConnection.localDescription)
            )
          );
        }
      };
    }
  },
  //create a offer SDP (peerConection already established)
  createOffer: async (newRequestWebRTC: RequestWebRTC): Promise<void> => {
    //grab the peer connection off the state to manipulate further
    let { webRTCpeerConnection } = newRequestWebRTC;

    if (newRequestWebRTC.webRTCDataChannel === 'Video') {
      let offer = await webRTCpeerConnection!.createOffer();
      await webRTCpeerConnection!.setLocalDescription(offer);
      appDispatch(
        newRequestWebRTCSet({
          ...newRequestWebRTC,
          webRTCOffer: JSON.stringify(offer),
        })
      );
    }

    // peerConnection.createDataChannel('')
  },
  // work-in-progress
  createAnswer: async (newRequestWebRTC: RequestWebRTC): Promise<void> => {
    let { webRTCpeerConnection, webRTCOffer } = newRequestWebRTC;

    if (!webRTCOffer || !webRTCpeerConnection) return;

    let offer = JSON.parse(webRTCOffer);
    await webRTCpeerConnection.setRemoteDescription(offer);

    let answer = await webRTCpeerConnection.createAnswer();
    await webRTCpeerConnection.setLocalDescription(answer);

    appDispatch(
      newRequestWebRTCSet({
        ...newRequestWebRTC,
        webRTCAnswer: JSON.stringify(answer),
      })
    );
  },
  addAnswer: async (newRequestWebRTC: RequestWebRTC): Promise<void> => {
    let { webRTCpeerConnection } = newRequestWebRTC;

    let answer = newRequestWebRTC.webRTCAnswer;
    if (!answer) return alert('Retrieve answer from peer first...');
    webRTCpeerConnection!.setRemoteDescription(JSON.parse(answer));

    webRTCpeerConnection!.ontrack = async (event) => {
      event.streams[0].getTracks().forEach((track) => {
        newRequestWebRTC.webRTCRemoteStream!.addTrack(track);
      });
    };
  },
  // let addAnswer = async () => {
  //   let answer = document.getElementById('Answer-sdp').value;
  //   if (!answer) return alert('Retrieve answer from peer first...');

  //   answer = JSON.parse(answer);

  //   if (!peerConnection.curentRemoteDescription) {
  //     peerConnection.setRemoteDescription(answer);
  //   }
  // };
};

export default webrtcPeerController;

class Peer {
  config: RTCConfiguration; //Really only bringing the ice servers rn
  connection: RTCPeerConnection; //Just a new instance of RTCPeerConnection object

  constructor(config: RTCConfiguration /*iceServerUrl: string[]*/) {
    //constructor takes in the config(iceserver) and iceServerUrl may be unecessary if I can grab it from the RTCConfiguration (config.iceServers??)
    this.config = config;
    this.connection = this.createConnection();
    this.connection.onicecandidateerror = (e: Event) => {
      console.error(e);
    };
  }

  createConnection(): RTCPeerConnection {
    const iceServers: RTCIceServer[] = this.config.iceServers || []; //
    const configuration: RTCConfiguration = {
      iceServers,
    };
    //returning a new RTCPeer connection object with the appropriate configuration
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
  async establishVideoStream() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    stream
      .getTracks()
      .forEach((track) => this.connection.addTrack(track, stream));
  }
}

const config: RTCConfiguration = {};

//replaced with a function that responds with the SDP answer after clicking send
//content should already contain offer/answer string
//inside the function use those strings to create connection
//Answer SDP should be contained in ReqRes obj
// `ReqRes` type need to be fixed consistently across the board
// To make the type for `content` work properly

//Ideally creating the answer here not sure what testSDP connection is testing if there is no generated answer already

async function testSDPConnection(content: any) {
  const { iceConfiguration, offer } = content.request.body;
  // Technically, setting the connection status as 'closed' right away
  // is not entirely accurated. Since we are closing the server a second
  // after it is opened to avoid timeout issue anyway, this is as good
  // as a 'closed' connection.
  // Also, the current setup only works with one iceServer. To expand
  // this feature we need to get the relevant `ReqRes` from `Store.getState()`
  // and add the response there. See `graphQLController.openSubscription()` for example
  const newReqRes = { ...content, connection: 'closed' };
  const pc = new Peer(iceConfiguration);
  const localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  });
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
      // appDispatch(responseDataSaved(newReqRes));
      // appDispatch(reqResUpdated(newReqRes));
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
      // appDispatch(responseDataSaved(newReqRes));
      // appDispatch(reqResUpdated(newReqRes));
      console.log('TURN Server is reachable!');
    }
  };
  await pc.establishAnswer(offer); //Generate/set the answer based on the provided offer
  const localDescription = pc.connection.localDescription; //get the generated answer
  if (localDescription) {
    const answer = new RTCSessionDescription(localDescription);

    //set remote Description to the anser
    await pc.connection.setRemoteDescription(answer);

    //Establish video stream
    await pc.establishVideoStream();

    //close the connection
    pc.connection.close();

    //return the SDP answer
    return answer;
  } else {
    //Handle case when localDescription is null
    console.log('Local description is null.');
    return null;
  }
  // //Set the remote Description to a new RTCSessionDescription with the answer passed in
  // await pc.connection.setRemoteDescription(new RTCSessionDescription(answer));
  // await pc.establishVideoStream();

  // pc.connection.close(); //close the connection
  // return answer; //Return the SDP answer => send to the UI to be displayed
}

//Need to convert to React/Redux
// let peerConnection; //source of truth throughout connection
// let localStream; //local client
// let remoteStream;

// //setup STUN server (free to use grab online)
// //generates ice candidates for us
// let servers = {
//   iceServers: [
//     {
//       urls: ['stun:stun1.1.google.com:19302', 'stun:stun2.1.google.com:19302'],
//     },
//   ],
// };

// //Initialize video connection locally
// const init = async () => {
//   localStream = await navigator.mediaDevices.getUserMedia({
//     video: true,
//     audio: false,
//   });

//   document.getElementById('user-1

// ').srcObject = localStream;
// };

// const createPeerConnection = async (sdpType) => {
//   peerConnection = new RTCPeerConnection(servers); //create the connection

//   remoteStream = new MediaCapabilities();
//   document.getElementById('user-2').srcObject = remoteStream;

//   localStream.getTracks().forEach((track) => {
//     peerConnection.addTrack(track, localStream);
//   });

//   peerConnection.ontrack = async (event) => {
//     event.streams[0].getTracks().forEach((track) => {
//       remoteStream.addTrack(track);
//     });
//   };

//   //make a series of req to stun servers automatically
//   peerConnection.onicecandidate = async (event) => {
//     //check for a candidate
//     if (event.candidate) {
//       //update the offer
//       console.log(
//         'before createOffer',
//         JSON.stringify(peerConnection.localDescription)
//       );
//       document.getElementById(sdpType).value = JSON.stringify(
//         peerConnection.localDescription
//       );
//     }
//   };
// };

// let createOffer = async () => {
//   createPeerConnection('offer-sdp');

//   let offer = await peerConnection.createOffer();
//   await peerConnection.setLocalDescription(offer);

//   console.log('after createOffer', JSON.stringify(offer));
//   document.getElementById('offer-sdp').value = JSON.stringify(offer);
// };

// const createAnswer = async () => {
//   createPeerConnection('answer-sdp');

//   let offer = document.getElementById('offer sdp here').value;
//   if (!offer) return alert('Retrieve offer from peer first...');

//   offer = JSON.parse(offer);
//   await peerConnection.setRemoteDescription(offer);

//   let answer = await peerConnection.createAnswer();
//   await peerConnection.setLocalDescription(answer);

//   document.getElementById('answer-sdp').value = JSON.stringify(answer);
// };

// let addAnswer = async () => {
//   let answer = document.getElementById('Answer-sdp').value;
//   if (!answer) return alert('Retrieve answer from peer first...');

//   answer = JSON.parse(answer);

//   if (!peerConnection.curentRemoteDescription) {
//     peerConnection.setRemoteDescription(answer);
//   }
// };

// init();

// document
//   .getElementById('webRTC-offerBtn')
//   .addEventListener('click', createOffer);

// document
//   .getElementById('webRTC-offerBtn')
//   .addEventListener('click', createAnswer);

// document
//   .getElementById('create answer here')
//   .addEventListener('click', addAnswer);

// //Signaling Server

