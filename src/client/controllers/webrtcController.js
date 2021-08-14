/* eslint-disable default-case */
/* eslint-disable camelcase */
let myHostname = window.location.hostname;
const PORT = 9000;

if (!myHostname) {
  myHostname = 'localhost';
}
log('Hostname: ' + myHostname);

// WebSocket chat/signaling channel variables.
let connection = null;
let clientID = 0;

let myUsername = null;
let targetUsername = null; // To store username of other peer
let myPeerConnection = null; // RTCPeerConnection
let dataChannel = null;

// Send a JavaScript object by converting it to JSON and sending
// it as a message on the WebSocket connection.

function sendToServer(msg) {
  const msgJSON = JSON.stringify(msg);
  log("Sending '" + msg.type + "' message: " + msgJSON);
  connection.send(msgJSON);
}

// Called when the "id" message is received; this message is sent by the
// server to assign this login session a unique ID number; in response,
// this function sends a "username" message to set our username for this
// session.
function setUsername() {
  // myUsername = document.getElementById('name').value;

  sendToServer({
    name: myUsername,
    date: Date.now(),
    id: clientID,
    type: 'username',
  });
}

// Open and configure the connection to the WebSocket server.

function connect() {
  let scheme = 'ws';
  // If this is an HTTPS connection, we have to use a secure WebSocket
  // connection too, so add another "s" to the scheme.
  if (document.location.protocol === 'https:') {
    scheme += 's';
  }

  // Build the URL of the WebSocket server.
  const serverUrl = scheme + '://' + myHostname + ':' + PORT;

  log(`Connecting to server: ${serverUrl}`);
  connection = new WebSocket(serverUrl, 'json');

  connection.onopen = function (evt) {
    // disable the connect button
  };

  connection.onerror = function (evt) {
    console.dir(evt);
  };

  connection.onmessage = function (evt) {
    // const chatBox = document.querySelector('.chatbox');
    let text = '';
    const msg = JSON.parse(evt.data);
    log('Message received: ');
    console.dir(msg);
    const time = new Date(msg.date);
    const timeStr = time.toLocaleTimeString();

    switch (msg.type) {
      case 'id':
        clientID = msg.id;
        setUsername();
        break;

      case 'username':
        text =
          '<b>User <em>' +
          msg.name +
          '</em> signed in at ' +
          timeStr +
          '</b><br>';
        break;

      case 'message':
        text =
          '(' + timeStr + ') <b>' + msg.name + '</b>: ' + msg.text + '<br>';
        break;

      case 'rejectusername':
        myUsername = msg.name;
        text =
          '<b>Your username has been set to <em>' +
          myUsername +
          '</em> because the name you chose is in use.</b><br>';
        break;

      case 'userlist': // Received an updated user list
        handleUserlistMsg(msg);
        break;

      case 'video-offer': // Invitation and offer to chat
        handleVideoOfferMsg(msg);
        break;

      case 'video-answer': // Callee has answered our offer
        handleVideoAnswerMsg(msg);
        break;

      case 'new-ice-candidate': // A new ICE candidate has been received
        handleNewICECandidateMsg(msg);
        break;

      default:
        log_error('Unknown message received:');
        log_error(msg);
    }

    // If there's text to insert into the chat buffer, do it here
  };
}

// Handles a click on the Send button (or pressing return/enter) by
// building a "message" object and sending it to the server.
function handleSendButton() {
  // const msg = {
  //   text: 'does it work',
  //   type: 'message',
  //   id: clientID,
  //   date: Date.now(),
  // };
  // sendToServer(msg);
  dataChannel.send('does it work');
}

// Create the RTCPeerConnection which knows how to talk to our
// selected STUN/TURN server and then uses getUserMedia() to find
// our camera and microphone and add that stream to the connection for
// use in our video call. Then we configure event handlers to get
// needed notifications on the call.

async function createPeerConnection(config) {
  log('Setting up a connection...');

  // Create an RTCPeerConnection which knows to use our chosen
  // STUN server.

  myPeerConnection = new RTCPeerConnection(config);

  // Set up event handlers for the ICE negotiation process.

  myPeerConnection.onicecandidate = handleICECandidateEvent;
  myPeerConnection.oniceconnectionstatechange =
    handleICEConnectionStateChangeEvent;
  myPeerConnection.onicegatheringstatechange =
    handleICEGatheringStateChangeEvent;
  myPeerConnection.onsignalingstatechange = handleSignalingStateChangeEvent;
  myPeerConnection.onnegotiationneeded = handleNegotiationNeededEvent;
  myPeerConnection.ondatachannel = handleDataChannelEvent;
  // myPeerConnection.ontrack = handleTrackEvent;
}

async function handleDataChannelEvent(event) {
  const incomingChannel = event.channel;
  myPeerConnection.dataChannel = incomingChannel;

  myPeerConnection.dataChannel.onopen = (event) =>
    console.log('Connection opened!');

  myPeerConnection.dataChannel.onclose = (event) =>
    console.log('Connection closed! Goodbye (^-^)');
  // when message received...
  //remoteConnection.dataChannel.onmessage = event => console.log("PeerA: " + event.data);
  myPeerConnection.dataChannel.onmessage = (event) =>
    console.log('PeerA: ' + event.data);
}
// Called by the WebRTC layer to let us know when it's time to
// begin, resume, or restart ICE negotiation.

async function handleNegotiationNeededEvent() {
  log('*** Negotiation needed');

  try {
    log('---> Creating offer');
    const offer = await myPeerConnection.createOffer();

    // If the connection hasn't yet achieved the "stable" state,
    // return to the caller. Another negotiationneeded event
    // will be fired when the state stabilizes.

    if (myPeerConnection.signalingState !== 'stable') {
      log("     -- The connection isn't stable yet; postponing...");
      return;
    }

    // Establish the offer as the local peer's current
    // description.

    log('---> Setting local description to the offer');
    await myPeerConnection.setLocalDescription(offer);

    // Send the offer to the remote peer.

    log('---> Sending the offer to the remote peer');
    sendToServer({
      name: myUsername,
      target: targetUsername,
      type: 'video-offer',
      sdp: myPeerConnection.localDescription,
    });
  } catch (err) {
    log(
      '*** The following error occurred while handling the negotiationneeded event:'
    );
    reportError(err);
  }
}

// Called by the WebRTC layer when events occur on the media tracks
// on our WebRTC call. This includes when streams are added to and
// removed from the call.
//
// track events include the following fields:
//
// RTCRtpReceiver       receiver
// MediaStreamTrack     track
// MediaStream[]        streams
// RTCRtpTransceiver    transceiver
//
// In our case, we're just taking the first stream found and attaching
// it to the <video> element for incoming media.

// function handleTrackEvent(event) {
//   log('*** Track event');
//   document.getElementById('received_video').srcObject = event.streams[0];
//   document.getElementById('hangup-button').disabled = false;
// }

// Handles |icecandidate| events by forwarding the specified
// ICE candidate (created by our local ICE agent) to the other
// peer through the signaling server.

function handleICECandidateEvent(event) {
  if (event.candidate) {
    log('*** Outgoing ICE candidate: ' + event.candidate.candidate);

    sendToServer({
      type: 'new-ice-candidate',
      target: targetUsername,
      candidate: event.candidate,
    });
  }
}

// Handle |iceconnectionstatechange| events. This will detect
// when the ICE connection is closed, or failed.
//
// This is called when the state of the ICE agent changes.

function handleICEConnectionStateChangeEvent(event) {
  log(
    '*** ICE connection state changed to ' + myPeerConnection.iceConnectionState
  );

  switch (myPeerConnection.iceConnectionState) {
    case 'closed':
    case 'failed':
      break;
  }
}

// Set up a |signalingstatechange| event handler. This will detect when
// the signaling connection is closed.
//
// NOTE: This will actually move to the new RTCPeerConnectionState enum
// returned in the property RTCPeerConnection.connectionState when
// browsers catch up with the latest version of the specification!

function handleSignalingStateChangeEvent(event) {
  log(
    '*** WebRTC signaling state changed to: ' + myPeerConnection.signalingState
  );
  switch (myPeerConnection.signalingState) {
    case 'closed':
      break;
  }
}

// Handle the |icegatheringstatechange| event. This lets us know what the
// ICE engine is currently working on: "new" means no networking has happened
// yet, "gathering" means the ICE engine is currently gathering candidates,
// and "complete" means gathering is complete. Note that the engine can
// alternate between "gathering" and "complete" repeatedly as needs and
// circumstances change.
//
// We don't need to do anything when this happens, but we log it to the
// console so you can see what's going on when playing with the sample.

function handleICEGatheringStateChangeEvent(event) {
  log(
    '*** ICE gathering state changed to: ' + myPeerConnection.iceGatheringState
  );
}

// Given a message containing a list of usernames, this function
// populates the user list box with those names, making each item
// clickable to allow starting a video call.

function handleUserlistMsg(msg) {
  console.log(msg);
}

// Handle a click on an item in the user list by inviting the clicked
// user to video chat. Note that we don't actually send a message to
// the callee here -- calling RTCPeerConnection.addTrack() issues
// a |notificationneeded| event, so we'll let our handler for that
// make the offer.

async function invite(evt, content) {
  log('Starting to prepare an invitation');
  if (myPeerConnection) {
    alert("You can't start a call because you already have one open!");
  } else {
    // const clickedUsername = evt.target.textContent;
    const clickedUsername = 'Colin';

    // Don't allow users to call themselves, because weird.

    if (clickedUsername === myUsername) {
      alert(
        "I'm afraid I can't let you talk to yourself. That would be weird."
      );
      return;
    }

    // Record the username being called for future reference

    targetUsername = clickedUsername;
    log('Inviting user ' + targetUsername);

    // Call createPeerConnection() to create the RTCPeerConnection.
    // When this returns, myPeerConnection is our RTCPeerConnection
    // and webcamStream is a stream coming from the camera. They are
    // not linked together in any way yet.

    log('Setting up connection to invite user: ' + targetUsername);
    createPeerConnection(content);

    dataChannel = myPeerConnection.createDataChannel('chatRoom1');

    dataChannel.onopen = (event) => console.log('Connection opened!');
    console.log(myPeerConnection);
  }
}

// Accept an offer to video chat. We configure our local settings,
// create our RTCPeerConnection, get and attach our local camera
// stream, then create and send an answer to the caller.

async function handleVideoOfferMsg(msg) {
  targetUsername = msg.name;

  // If we're not already connected, create an RTCPeerConnection
  // to be linked to the caller.

  log('Received video chat offer from ' + targetUsername);
  if (!myPeerConnection) {
    createPeerConnection();
  }

  // We need to set the remote description to the received SDP offer
  // so that our local WebRTC layer knows how to talk to the caller.

  const desc = new RTCSessionDescription(msg.sdp);

  // If the connection isn't stable yet, wait for it...

  if (myPeerConnection.signalingState !== 'stable') {
    log("  - But the signaling state isn't stable, so triggering rollback");

    // Set the local and remove descriptions for rollback; don't proceed
    // until both return.
    await Promise.all([
      myPeerConnection.setLocalDescription({ type: 'rollback' }),
      myPeerConnection.setRemoteDescription(desc),
    ]);
    return;
  }
  log('  - Setting remote description');
  await myPeerConnection.setRemoteDescription(desc);

  log('---> Creating and sending answer to caller');

  await myPeerConnection.setLocalDescription(
    await myPeerConnection.createAnswer()
  );

  sendToServer({
    name: myUsername,
    target: targetUsername,
    type: 'video-answer',
    sdp: myPeerConnection.localDescription,
  });
}

// Responds to the "video-answer" message sent to the caller
// once the callee has decided to accept our request to talk.

async function handleVideoAnswerMsg(msg) {
  log('*** Call recipient has accepted our call');

  dataChannel.onopen = (event) => console.log('Connection opened!');
  // Configure the remote description, which is the SDP payload
  // in our "video-answer" message.

  const desc = new RTCSessionDescription(msg.sdp);
  await myPeerConnection.setRemoteDescription(desc).catch(reportError);
}

// A new ICE candidate has been received from the other peer. Call
// RTCPeerConnection.addIceCandidate() to send it along to the
// local ICE framework.

async function handleNewICECandidateMsg(msg) {
  const candidate = new RTCIceCandidate(msg.candidate);

  log('*** Adding received ICE candidate: ' + JSON.stringify(candidate));
  try {
    await myPeerConnection.addIceCandidate(candidate);
  } catch (err) {
    reportError(err);
  }
}

// Handle errors which occur when trying to access the local media
// hardware; that is, exceptions thrown by getUserMedia(). The two most
// likely scenarios are that the user has no camera and/or microphone
// or that they declined to share their equipment when prompted. If
// they simply opted not to share their media, that's not really an
// error, so we won't present a message in that situation.

function handleGetUserMediaError(e) {
  log_error(e);
  switch (e.name) {
    case 'NotFoundError':
      alert(
        'Unable to open your call because no camera and/or microphone' +
          'were found.'
      );
      break;
    case 'SecurityError':
    case 'PermissionDeniedError':
      // Do nothing; this is the same as the user canceling the call.
      break;
    default:
      alert('Error opening your camera and/or microphone: ' + e.message);
      break;
  }

  // Make sure we shut down our end of the RTCPeerConnection so we're
  // ready to try again.
}

// Output logging information to console.

function log(text) {
  const time = new Date();
  console.log('[' + time.toLocaleTimeString() + '] ' + text);
}

// Output an error message to console.

function log_error(text) {
  const time = new Date();
  console.trace('[' + time.toLocaleTimeString() + '] ' + text);
}

function reportError(errMessage) {
  log_error(`Error ${errMessage.name}: ${errMessage.message}`);
}

export { connect, handleSendButton, invite };
