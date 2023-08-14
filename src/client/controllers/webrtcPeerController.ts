import store, { appDispatch } from '../toolkit-refactor/store';
import {
  newRequestWebRTCSet,
  newRequestWebRTCOfferSet,
} from '../toolkit-refactor/slices/newRequestSlice';
import {
  ReqRes,
  RequestWebRTC,
  RequestWebRTCText,
  ResponseWebRTC,
} from '../../types';
import { responseDataSaved } from '../toolkit-refactor/slices/reqResSlice';

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
      localStream.onopen = () => console.log('data channel opened');
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

  addAnswer: async (reqRes: ReqRes): Promise<void> => {
    let { request, response } = reqRes as {
      request: RequestWebRTC;
      response: ResponseWebRTC;
    };

    request.webRTCpeerConnection!.setRemoteDescription(
      JSON.parse(request.webRTCAnswer)
    );

    if (request.webRTCDataChannel === 'Video') {
      request.webRTCpeerConnection!.ontrack = async (event: RTCTrackEvent) => {
        event.streams[0].getTracks().forEach((track: MediaStreamTrack) => {
          (<MediaStream>request.webRTCRemoteStream!).addTrack(track);
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
            request.webRTCLocalStream as MediaStream;
          (<HTMLVideoElement>(
            document.getElementById('remotestream')
          )).srcObject = request.webRTCRemoteStream as MediaStream;
        }
      }, 500);
    }
    if (request.webRTCDataChannel === 'Text') {
      (<RequestWebRTCText>request).webRTCLocalStream!.onmessage = (
        event: MessageEvent
      ) => {
        let newString = event.data.slice(1, -1);
        let messageObject = {
          data: newString,
          timeReceived: Date.now(),
        };

        let state = store.getState()
        if (state.reqRes.currentResponse.response) {  
  
          let newWebRTCMessages = state.reqRes.currentResponse.response.webRTCMessages.concat(messageObject);
          console.log('newWebRTCMessages', newWebRTCMessages);
  
          appDispatch(
            responseDataSaved({
              ...reqRes,
              response: {
                webRTCMessages: newWebRTCMessages,
              },
            })
          );

        }

        let textFeed = document.getElementById('textFeed');
        if (textFeed) {
          textFeed.innerText += newString + '\n';
        }
      };
    }
  },
};

export default webrtcPeerController;

