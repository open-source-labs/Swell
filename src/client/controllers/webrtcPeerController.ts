import store, { appDispatch } from '../toolkit-refactor/store';
import {
  newRequestWebRTCSet,
  newRequestWebRTCOfferSet,
  newRequestWebRTCAnswerSet,
} from '../toolkit-refactor/slices/newRequestSlice';
import {
  ReqRes,
  RequestWebRTC,
  RequestWebRTCText,
  ResponseWebRTC,
  ResponseWebRTCText,
} from '../../types';
import { responseDataSaved } from '../toolkit-refactor/slices/reqResSlice';
import { send } from 'process';
const webrtcPeerController = {
  // peer 1 and peer 2 both need to create a peer connection
  // but peer 1 needs to create a data channel
  // and peer 2 needs to receive a data channel
  createPeerConnection: async (
    newRequestWebRTC: RequestWebRTC
  ): Promise<void> => {
    let servers = {
      iceServers: [
        {
          urls: ['stun:stun.l.google.com:19302', 'stun:stun.l.google.com:5349'],
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
        if (event.candidate && peerConnection.localDescription!.type === 'offer') {
          appDispatch(
            newRequestWebRTCOfferSet(
              JSON.stringify(peerConnection.localDescription) 
            )
          );
        } else if (event.candidate && peerConnection.localDescription!.type === 'answer') {
          appDispatch(
            newRequestWebRTCAnswerSet(
              JSON.stringify(peerConnection.localDescription) 
            )
          );
        }
      };
    } else if (newRequestWebRTC.webRTCDataChannel === 'Text') {
      //

      let localStream = peerConnection.createDataChannel('textChannel');
      localStream.onopen = () => console.log('data channel opened!!!');
      localStream.onclose = () => console.log('data channel closed :(');

      peerConnection.ondatachannel = (event) => {
        const receiveChannel = event.channel;
        receiveChannel.onmessage = (event) => {
          console.log('message received:', event.data);
        };
      };
      // console.log('peerConnection:', peerConnection)
      // console.log('localstream:', localStream)
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
        if (event.candidate && peerConnection.localDescription!.type === 'offer') { //debugged
          appDispatch(
            newRequestWebRTCOfferSet(
              //should we be adding a ...peerConnection here spreading out the rest of the peerConnection object? also why isn't this updating the newWebRTCRequest object?
              JSON.stringify(peerConnection.localDescription)
            )
          );
        } else if (event.candidate && peerConnection.localDescription!.type === 'answer') {//added this plus an answerSet reducer so the answer wasn't populating both the answer and offer text boxes (and being two different versions of the answer at that)
          appDispatch(
            newRequestWebRTCAnswerSet(
              JSON.stringify(peerConnection.localDescription)
            )
          );
        }
      };
    }
  },
  // what in create offer triggers the ice candidate to be sent?
  createOffer: async (newRequestWebRTC: RequestWebRTC): Promise<void> => {
    //grab the peer connection off the state to manipulate further
    let { webRTCpeerConnection } = newRequestWebRTC;
    console.log('webRTCPeerConnect:', webRTCpeerConnection);
    let offer = await webRTCpeerConnection!.createOffer();
    console.log('offer:', offer);
    await webRTCpeerConnection!.setLocalDescription(offer); //what is this line doing that is not already done?
    console.log('webRTCaftersetofLocalDes:', webRTCpeerConnection);
    appDispatch(
      newRequestWebRTCSet({
        // newRequestWebRTCSet mutates the newRequestWebRTC state to have the offer
        ...newRequestWebRTC,
        webRTCOffer: JSON.stringify(offer),
      })
    );
    console.log('newRequestWebRTCCheckAfterOffer:', newRequestWebRTC);
  },

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
    console.log('newRequestWebRTCCheckAfterAnswer:', newRequestWebRTC);
  },

  addAnswer: async (newRequestWebRTC: RequestWebRTC): Promise<void> => {
    let { webRTCpeerConnection } = newRequestWebRTC;
    let answer = JSON.parse(newRequestWebRTC.webRTCAnswer);
    await webRTCpeerConnection!.setRemoteDescription(answer);
  },

  sendMessages: async (reqRes: ReqRes, messages: string): Promise<void> => {
    let { request } = reqRes as { request: RequestWebRTCText };
    console.log('im here too');
    console.log('request from mesaages :', request);

    (<RequestWebRTCText>request).webRTCLocalStream!.send(
      JSON.stringify({ data: messages })
    );
  },

  dataStream: async (reqRes: ReqRes): Promise<void> => {
    let { request, response } = reqRes as {
      request: RequestWebRTC;
      response: ResponseWebRTC;
    };

    // request.webRTCpeerConnection!.setRemoteDescription(
    //   JSON.parse(request.webRTCAnswer)
    // );

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
          let newWebRTCMessages = (<ResponseWebRTCText>(
            state.reqRes.currentResponse.response
          )).webRTCMessages.concat(messageObject);
          let request = state.reqRes.currentResponse.request;
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

