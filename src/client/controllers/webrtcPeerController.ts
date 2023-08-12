import { appDispatch } from '../toolkit-refactor/store';
import {
  newRequestWebRTCSet,
  newRequestWebRTCOfferSet,
} from '../toolkit-refactor/slices/newRequestSlice';

import { RequestWebRTC } from '../../types';

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
    let peerConnection = new RTCPeerConnection(servers);

    if (newRequestWebRTC.webRTCDataChannel === 'Video') {
      let localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      if (document.getElementById('localstream')) {
        (<HTMLVideoElement>document.getElementById('localstream')).srcObject =
          localStream;
      }

      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
      });

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
          appDispatch(
            newRequestWebRTCOfferSet(
              JSON.stringify(peerConnection.localDescription)
            )
          );
        }
      };
    } else if (newRequestWebRTC.webRTCDataChannel === 'Text') {
      let localStream = peerConnection.createDataChannel('textChannel');
      localStream.onmessage = (e) => {
        console.log('just got a message');
      };
      localStream.onopen = (e) => console.log('data channel connected');

      appDispatch(
        newRequestWebRTCSet({
          ...newRequestWebRTC,
          webRTCpeerConnection: peerConnection,
          webRTCLocalStream: localStream,
        })
      );

      peerConnection.onicecandidate = async (
        event: RTCPeerConnectionIceEvent
      ): Promise<void> => {
        if (event.candidate) {
          appDispatch(
            newRequestWebRTCOfferSet(
              JSON.stringify(peerConnection.localDescription)
            )
          );
        }
      };
    }
  },

  createOffer: async (newRequestWebRTC: RequestWebRTC): Promise<void> => {
    //grab the peer connection off the state to manipulate further
    let { webRTCpeerConnection } = newRequestWebRTC;
    let offer = await webRTCpeerConnection!.createOffer();
    await webRTCpeerConnection!.setLocalDescription(offer);
    appDispatch(
      newRequestWebRTCSet({
        ...newRequestWebRTC,
        webRTCOffer: JSON.stringify(offer),
      })
    );
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
    let { webRTCpeerConnection, webRTCLocalStream } = newRequestWebRTC;

    let answer = newRequestWebRTC.webRTCAnswer;
    if (!answer) return alert('Retrieve answer from peer first...');
    webRTCpeerConnection!.setRemoteDescription(JSON.parse(answer));

    if (newRequestWebRTC.webRTCDataChannel === 'Video') {
      webRTCpeerConnection!.ontrack = async (event) => {
        event.streams[0].getTracks().forEach((track) => {
          newRequestWebRTC.webRTCRemoteStream!.addTrack(track);
        });
      };

      // this waits for HTML elements localstream and remotestream to render before connecting the srcObject. Should be refactored into better implementation
      setTimeout(() => {
        if (
          !document.getElementById('remotestream') ||
          !document.getElementById('localstream')
        ) {
          alert('error');
        } else {
          (<HTMLVideoElement>document.getElementById('localstream')).srcObject =
            newRequestWebRTC.webRTCLocalStream;
          (<HTMLVideoElement>(
            document.getElementById('remotestream')
          )).srcObject = newRequestWebRTC.webRTCRemoteStream;
        }
      }, 500);
    } else if (newRequestWebRTC.webRTCDataChannel === 'Text') {
      webRTCLocalStream!.onmessage = (e) => {
        let newString = e.data.slice(1, -1);
        document.getElementById('textFeed').innerText += newString + '\n';
      };
    }
  },
};

export default webrtcPeerController;

