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
  ResponseWebRTCText,
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
            'stun:stun.l.google.com:19302',
            'stun:stun.l.google.com:5349',
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
      localStream.onclose = () => console.log('data channel closed')
      console.log('peerConnection:', peerConnection)
      console.log('localstream:', localStream)
      console.log('newRequestWebRTCcheck:', newRequestWebRTC)
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
        console.log('event:', event)
        if (event.candidate) {
          appDispatch(
            newRequestWebRTCOfferSet(      // newRequestWebRTCOfferSet mutates the newRequestWebRTC.webrtcOffer state 
              JSON.stringify(peerConnection.localDescription)
            )
          );
        }
        console.log('newRequestWebRTCCheck4:', newRequestWebRTC)
      };

    }
  },

  createOffer: async (newRequestWebRTC: RequestWebRTC): Promise<void> => {
    //grab the peer connection off the state to manipulate further
    console.log('newRequestWebRTCCheck2:', newRequestWebRTC)
    let { webRTCpeerConnection } = newRequestWebRTC;
    console.log('webRTCPeerConnect:', webRTCpeerConnection)
    let offer = await webRTCpeerConnection!.createOffer();
    console.log('offer:', offer)
    await webRTCpeerConnection!.setLocalDescription(offer); //what is this line doing that is not already done?
    console.log('webRTCaftersetofLocalDes:', webRTCpeerConnection)
    appDispatch(
      newRequestWebRTCSet({
        ...newRequestWebRTC,
        webRTCOffer: JSON.stringify(offer),
      })
    );
    console.log('newRequestWebRTCCheck3:', newRequestWebRTC)
  },

  // need to include methodology to send offer to other peer

  // also need to send ice candidate to other peer

  // Ability to receive offer and candidate from other peer (using websockets)

  // peer should be able to accept offer and candidate
  // peer should be able to set the offer received as the remote description



  // work-in-progress ,,, this function is for the situation you are peer 2 and you receive an offer from peer 1
  createAnswer: async (newRequestWebRTC: RequestWebRTC): Promise<void> => {
    let { webRTCpeerConnection, webRTCOffer } = newRequestWebRTC;

    if (!webRTCOffer || !webRTCpeerConnection) return alert('Invalid Offer');

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
    console.log('newRequestWebRTCCheck5:', newRequestWebRTC)
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

        let state = store.getState();
        if (state.reqRes.currentResponse.response) {
          let newWebRTCMessages =
            (<ResponseWebRTCText>state.reqRes.currentResponse.response).webRTCMessages.concat(
              messageObject
            );
          let request = state.reqRes.currentResponse.request
          appDispatch(
            responseDataSaved({
              ...reqRes,
              request,
              response: {
                webRTCMessages: newWebRTCMessages,
              },
            })
          );
        }
      };
    }
  },
};

export default webrtcPeerController;

