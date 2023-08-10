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
};

export default webrtcPeerController;