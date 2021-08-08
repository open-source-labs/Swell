

// This code originate from [WebRTC Crash Course (Hussein Nasser)](https://www.youtube.com/watch?v=FExZvpVvYxA)

//received from signalling
//const offer = {"type":"offer","sdp":"v=0\r\no=- 641848531263977859 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=group:BUNDLE 0\r\na=msid-semantic: WMS\r\nm=application 29043 UDP/DTLS/SCTP webrtc-datachannel\r\nc=IN IP4 0.0.0.0\r\na=candidate:1755481640 1 udp 2113937151 de7f09a6-8602-45b3-8443-9cc878f32e2c.local 50661 typ host generation 0 network-cost 999\r\na=candidate:842163049 1 udp 1677729535 209.194.90.6 29043 typ srflx raddr 0.0.0.0 rport 0 generation 0 network-cost 999\r\na=ice-ufrag:Ypzo\r\na=ice-pwd:AqSXcyyXNjriK7iuyLVTk5HM\r\na=ice-options:trickle\r\na=fingerprint:sha-256 03:CD:8B:93:6C:8A:4A:12:DD:21:FF:29:B9:38:E4:24:4A:A1:1A:01:7D:72:61:3D:6F:37:97:1C:27:6E:68:A5\r\na=setup:actpass\r\na=mid:0\r\na=sctp-port:5000\r\na=max-message-size:262144\r\n"};

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
  // {
  //   urls: 'stun:stun1.l.google.com:19302' 
  // },
  {
    // new coturn STUN/TURN
    urls: 'stun:104.153.154.109', 
  },
); 

// instanciate a new peer connection - remote connection (rc)
const remoteConnection = new RTCPeerConnection(iceConfiguration);

// listen for ICE candiates.  Each time a candidate is added to the list, re-log the whole SDP
remoteConnection.onicecandidate = event => {
  if (event && event.target && event.target.iceGatheringState === 'complete') {
    console.log('done gathering candidates - got iceGatheringState complete');
} else if (event && event.candidate == null) {
    console.log('done gathering candidates - got null candidate');
} else {
    console.log(event.target.iceGatheringState, event, remoteConnection.localDescription);
    console.log("corresponding SDP for above ICE candidate in JSON:");
    console.log(JSON.stringify(remoteConnection.localDescription));
}
};

remoteConnection.ondatachannel = event => {
  // create new property on rc object and assign it to be the incoming data channel (*** is this the name that was passed in by the local client? ***)
  const incommingChannel = event.channel;
  remoteConnection.dataChannel = incommingChannel;
  // when the channel is openned ...
  //remoteConnection.dataChannel.onopen = event => console.log("Connection opened!");
  remoteConnection.dataChannel.onopen = event => console.log("Connection opened!");
  // when the channel is closed ...
  //remoteConnection.dataChannel.onclose = event => console.log("Connection closed! Goodbye (^-^)");
  remoteConnection.dataChannel.onclose = event => console.log("Connection closed! Goodbye (^-^)");
  // when message received...
  //remoteConnection.dataChannel.onmessage = event => console.log("PeerA: " + event.data);
  remoteConnection.dataChannel.onmessage = event => console.log("PeerA: " + event.data);
  // assign the channel
  
}

// set remote description to be client-A's offer
remoteConnection.setRemoteDescription(offer).then( a => console.log("offer set!"));



// set answer -- this should cause the connection to open
remoteConnection.createAnswer().then( answer => remoteConnection.setLocalDescription(answer) ).then( a => {
  console.log("answer created!");
  //console.log(JSON.stringify(remoteConnection.localDescription));
});  //*** does "a" need to be "answer" ??


console.log('ICE gathering state: ', remoteConnection.iceGatheringState);

// ====== hard coded messages =====
remoteConnection.dataChannel.send("Yo! I'm great!  Waddabout you?");