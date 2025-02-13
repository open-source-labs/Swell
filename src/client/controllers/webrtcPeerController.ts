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
  createPeerConnection: async (
    newRequestWebRTC: RequestWebRTC,
    currentReqRes: ReqRes
  ) => {
    // const enableAudio =
    //   store.getState().newRequest.newRequestWebRTC.enableAudio ?? false;
    const enableAudio = newRequestWebRTC.enableAudio ?? false; //if null set to false

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
        // request access to user camera
        video: true, // request access to video
        audio: enableAudio, //if enable audio is true request access to audio //not if false
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
          enableAudio,
        })
      );
      peerConnection.onicecandidate = async (
        event: RTCPeerConnectionIceEvent
      ): Promise<void> => {
        if (
          event.candidate &&
          peerConnection.localDescription!.type === 'offer'
        ) {
          appDispatch(
            newRequestWebRTCOfferSet(
              JSON.stringify(peerConnection.localDescription)
            )
          );
        } else if (
          event.candidate &&
          peerConnection.localDescription!.type === 'answer'
        ) {
          appDispatch(
            newRequestWebRTCAnswerSet(
              JSON.stringify(peerConnection.localDescription)
            )
          );
        }
      };
    } else if (newRequestWebRTC.webRTCDataChannel === 'Audio') {
      let localStream = await navigator.mediaDevices.getUserMedia({
        // request access to user camera
        video: false, // request access to video
        audio: true, //if enable audio is true request access to audio //not if false
      }); // from

      if (document.getElementById('localstream')) {
        (<HTMLVideoElement>document.getElementById('localstream')).srcObject =
          localStream;
      }

      localStream.getTracks().forEach((track) => {
        // iterates over tracks in local stream
        peerConnection.addTrack(track, localStream);
      }); // adds them to the peer connection using add track

      let remoteStream = new MediaStream(); //initialize new media stream object
      peerConnection.ontrack = async (event) => {
        // adds them to the peer connection using add track
        event.streams[0].getTracks().forEach((track) => {
          // sets up an event handler for on track event of peer connection object
          // returns array of tracks
          remoteStream.addTrack(track);
        });
      };

      appDispatch(
        // update redux state
        newRequestWebRTCSet({
          //new state object is created to update redux object
          ...newRequestWebRTC, // copy properties from existing object
          webRTCpeerConnection: peerConnection,
          webRTCLocalStream: localStream,
          webRTCRemoteStream: remoteStream, // remote stream overwritten
        })
      );
      peerConnection.onicecandidate = async (
        event: RTCPeerConnectionIceEvent
      ): Promise<void> => {
        if (
          event.candidate &&
          peerConnection.localDescription!.type === 'offer'
        ) {
          appDispatch(
            newRequestWebRTCOfferSet(
              JSON.stringify(peerConnection.localDescription)
            )
          );
        } else if (
          event.candidate &&
          peerConnection.localDescription!.type === 'answer'
        ) {
          appDispatch(
            newRequestWebRTCAnswerSet(
              JSON.stringify(peerConnection.localDescription)
            )
          );
        }
      };
    } else if (newRequestWebRTC.webRTCDataChannel === 'Text') {
      //     const { request, response } = currentReqRes as {
      //   request: RequestWebRTCText;
      //   response: ResponseWebRTCText;
      // };

      let localStream = peerConnection.createDataChannel('textChannel');
      localStream.onopen = () => console.log('data channel opened!!!');
      localStream.onclose = () => console.log('data channel closed :(');

      peerConnection.ondatachannel = (event) => {
        const receiveChannel = event.channel;
        // receiveChannel.onmessage = (event) => {
        //   console.log('message received:', event.data);

        // };
        receiveChannel.onmessage = (event: MessageEvent) => {
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
                ...currentReqRes,
                request,
                response: {
                  webRTCMessages: newWebRTCMessages,
                },
              })
            );
          }
        };
      };
      appDispatch(
        newRequestWebRTCSet({
          ...newRequestWebRTC,
          webRTCpeerConnection: peerConnection,
          webRTCLocalStream: localStream,
        })
      );
    }
    peerConnection.onicecandidate = async (
      event: RTCPeerConnectionIceEvent
    ) => {
      // sets up event handler for onice canditates
      if (
        event.candidate &&
        peerConnection.localDescription!.type === 'offer'
      ) {
        // checks for canidate and if event type is offer
        appDispatch(
          newRequestWebRTCOfferSet(
            JSON.stringify(peerConnection.localDescription)
          )
        ); // dispatches action to set a new WebRTC offer request
      } else if (
        event.candidate &&
        peerConnection.localDescription!.type === 'answer'
      ) {
        // checks for canditate with description type answer
        appDispatch(
          newRequestWebRTCAnswerSet(
            JSON.stringify(peerConnection.localDescription)
          )
        ); //dispatches action to create answer
      }
    };
  },
  // what in create offer triggers the ice candidate to be sent?
  createOffer: async (newRequestWebRTC: RequestWebRTC): Promise<void> => {
    //grab the peer connection off the state to manipulate further
    console.log('checking peer connection inside createOffer');
    console.log(
      'webRTCpeerConnection exists:',
      !!newRequestWebRTC.webRTCpeerConnection
    );

    let { webRTCpeerConnection } = newRequestWebRTC;
    if (!webRTCpeerConnection) return;
    console.log('webRTCPeerConnect:', webRTCpeerConnection);
    let offer = await webRTCpeerConnection!.createOffer();
    console.log('offer:', offer);
    await webRTCpeerConnection!.setLocalDescription(offer); //what is this line doing that is not already done?
    appDispatch(
      newRequestWebRTCSet({
        // newRequestWebRTCSet mutates the newRequestWebRTC state to have the offer
        ...newRequestWebRTC,
        webRTCOffer: JSON.stringify(offer),
      })
    );
  },

  createAnswer: async (newRequestWebRTC: RequestWebRTC): Promise<void> => {
    let { webRTCpeerConnection, webRTCOffer } = newRequestWebRTC;

    if (!webRTCOffer || !webRTCpeerConnection) return alert('Invalid Offer');

    let offer = JSON.parse(webRTCOffer);
    await webRTCpeerConnection.setRemoteDescription(offer);

    let answer = await webRTCpeerConnection.createAnswer();
    console.log('answer:', answer);
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

