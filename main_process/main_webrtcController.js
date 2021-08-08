  const iceConfiguration = {
    iceServers: [
      {
        url: 'stun:104.153.154.109:3478',
      },
      {  
        url: 'turn:104.153.154.109',
        username: 'teamswell',
        credential: 'cohortla44',
      },
    ]
  };

//   const MESSAGE = {};

//   const signaling = new WebSocket('ws://127.0.0.1:1337');
  
  const createPeerConnection = () => {
    const pc = new RTCPeerConnection(iceConfiguration);
    // declare placeholder for the offer.  We'll assign it an SDP value later in the flow.
    let offer;
    pc.onnegotiationneeded = async () => {
      offer = await createAndSendOffer(pc);
    };
    // listen for ICE candiates.  Each time a candidate is added to the list, re-log the whole SDP
    pc.onicecandidate = (event) => {
    //   if (event && event.candidate) {
    //     sendMessage({
    //       message_type: 'CANDIDATE',
    //       content: event.candidate,
    //     });
    //   } else 
      if (event && event.target && event.target.iceGatheringState === 'complete') {
        console.log('done gathering candidates - got iceGatheringState complete');
      } else if (event && event.candidate === null) {
        console.log('done gathering candidates - got null candidate');
      } else {
        console.log(event.target.iceGatheringState, event, localConnection.localDescription);
        console.log('corresponding SDP for above ICE candidate in JSON:');
        console.log(JSON.stringify(localConnection.localDescription));
      }
    }

    return pc;
  };
  
  // triggerOffer - 
  // const triggerOffer = new EventTarget();
  // triggerOffer.addEventListener('createOffer', createAndSendOffer);
  // // triggerOffer.dispatchEvent(new Event('createOffer'));

  const createAndSendOffer = async (peerConnection) => {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    // sendMessage({
    //   message_type: 'SDP',
    //   content: offer,
    // });
    console.log('offer set successfully!');
    return offer;
  };
  
  const addMessageHandler = (peerConnection, message) => {
    // signaling.onmessage = async (message) => {
      const data = JSON.parse(message.data);
      if (!data) return;
      const { message_type, content } = data;
      if (message_type === 'CANDIDATE') {
        await peerConnection.addIceCandidate(content); 
      } else if (message_type === 'SDP') {
        if (content.type === 'offer') {
          await peerConnection.setRemoteDescription(content);
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
        //   sendMessage({
        //     message_type: 'SDP',
        //     content: answer,
        //   });
          return answer;
        } else if (content.type === 'answer') {
          await peerConnection.setRemoteDescription(content);
        } else {
          console.log('Unsupported SDP type.');
        }
      }
    // }
  };
  
  const addDataChannel = (peerConnection) => {
    // on our local connection, create a data channel and pass it the name "chatRoom1"
    const dataChannel = peerConnection.createDataChannel('chatRoom1');
    // when the channel is openned ...
    dataChannel.onopen = async (event) => console.log('Connection opened!');
    // when the channel is closed ...
    dataChannel.onclose = (event) => console.log('Connection closed! Goodbye (^-^)');
    // when message received...
    dataChannel.onmessage = async (event) => console.log(`PeerB: ${event.data}`);
    return dataChannel;
  };
  
//   const sendMessage = (message) => {
//     if (code) {
//       signaling.send(JSON.stringify({
//         ...message,
//         code,
//       }));
//     }
//   }