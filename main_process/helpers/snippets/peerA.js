// This code originate from [WebRTC Crash Course (Hussein Nasser)](https://www.youtube.com/watch?v=FExZvpVvYxA)


//you can specify a STUN server here
const iceConfiguration = {};
iceConfiguration.iceServers = [];
//turn server
iceConfiguration.iceServers.push(
  {
    // new coturn STUN/TURN
    urls: 'turn:104.153.154.109', 
    username: 'teamswell',
    credential: 'cohortla44',
    credentialType: 'password' 
  },
);
//stun  server
iceConfiguration.iceServers.push(
  {
    urls: 'stun:stun1.l.google.com:19302' 
  },
  {
    urls: 'stun:104.153.154.109',  
  },
);


// create local connection as instance of RTCPeerConnection
const localConnection = new RTCPeerConnection(iceConfiguration);

// listen for ICE candiates.  Each time a candidate is added to the list, re-log the whole SDP
// localConnection.onicecandidate = event => {
//   console.log("New ICE candidate! reprinting SDP:");
//   console.log(JSON.stringify(localConnection.localDescription));
//   console.log('ICE gathering state: ', localConnection.iceGatheringState);
// };

// listen for ICE candiates.  Each time a candidate is added to the list, re-log the whole SDP
localConnection.onicecandidate = event => { 
  if (event && event.target && event.target.iceGatheringState === 'complete') {
      console.log('done gathering candidates - got iceGatheringState complete');
  } else if (event && event.candidate == null) {
      console.log('done gathering candidates - got null candidate');
  } else {
      console.log(event.target.iceGatheringState, event, localConnection.localDescription);
      console.log("corresponding SDP for above ICE candidate in JSON:");
      console.log(JSON.stringify(localConnection.localDescription));
  }
};



// on our local connection, create a data channel and pass it the name "chatRoom1"
const dataChannel = localConnection.createDataChannel("chatRoom1");

// when the channel is openned ...
dataChannel.onopen = event => console.log("Connection opened!");

// when the channel is closed ...
dataChannel.onclose = event => console.log("Connection closed! Goodbye (^-^)");

// when message received...
dataChannel.onmessage = event => console.log("PeerB: " + event.data);



localConnection.createOffer().then(offer => localConnection.setLocalDescription(offer) ).then( a => console.log("offer set successfully!"));

console.log('ICE gathering state: ', localConnection.iceGatheringState);




// signalling would happen here 
// once the offer (SDP) is created, send it to peerB

// offer (SDP) sent to client-B : 
/*
{"type":"offer","sdp":"v=0\r\no=- 7740307644917611919 3 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=group:BUNDLE 1\r\na=msid-semantic: WMS\r\nm=application 64959 UDP/DTLS/SCTP webrtc-datachannel\r\nc=IN IP4 0.0.0.0\r\na=candidate:2545851293 1 udp 2113937151 0547e644-b008-48b0-bf5e-bc797d7ef07a.local 64959 typ host generation 0 network-cost 999\r\na=ice-ufrag:9/lS\r\na=ice-pwd:mAPSUHeBBTWvbgk4eS72S3DG\r\na=ice-options:trickle\r\na=fingerprint:sha-256 C0:5E:34:D2:B9:0E:87:A4:F7:0F:A4:D2:17:D2:29:1B:FA:0D:E7:F8:02:0B:93:8F:58:FF:3F:D6:B1:FB:5B:CF\r\na=setup:actpass\r\na=mid:1\r\na=sctp-port:5000\r\na=max-message-size:262144\r\n"}
*/

// answer (SDP) received from client-B
//const answer = {"type":"answer","sdp":"v=0\r\no=- 7460644339722322638 3 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=group:BUNDLE 1\r\na=msid-semantic: WMS\r\nm=application 61403 UDP/DTLS/SCTP webrtc-datachannel\r\nc=IN IP4 0.0.0.0\r\nb=AS:30\r\na=candidate:2545851293 1 udp 2113937151 2a20788c-db46-4321-8e26-c73da928b735.local 61403 typ host generation 0 network-cost 999\r\na=ice-ufrag:Oypf\r\na=ice-pwd:G3dR0BtbIKqDBLyU30QxGoef\r\na=ice-options:trickle\r\na=fingerprint:sha-256 D8:14:56:F3:07:54:C7:3E:54:99:EF:48:47:9A:DC:DA:32:25:E2:41:F0:5B:83:9C:CB:F5:C8:F1:02:48:FB:86\r\na=setup:active\r\na=mid:1\r\na=sctp-port:5000\r\na=max-message-size:262144\r\n"};

// set remote description to be the "answer"
localConnection.setRemoteDescription(answer).then( a => console.log("answer set!"));

// ========================== hard coded message exchange ===============
dataChannel.send("Yo! peer B, what up?");
