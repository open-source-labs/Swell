document.addEventListener('DOMContentLoaded', () => {
  // initial debug logs
  console.log('DOMContentLoaded');
  console.log('entering index.js');

  // select elements from the DOM

  const localSdpDisplay = document.querySelector('.local-sdp-text');
  const btnSetLocalSDP = document.querySelector('.btn.local-sdp');
  const inputRemoteSDP = document.querySelector('.input.remote-sdp');
  const btnSetRemoteSDP = document.querySelector('.btn.remote-sdp');
  const inputMessage = document.querySelector('.input.message-input');
  const messageDisplay = document.querySelector('.messages-display');
  const btnSendMessage = document.querySelector('.btn.message-input');
  btnSendMessage.disabled = true;

  // define roles
  const roles = {
    pending: 'PENDING',
    initiator: 'INITIATOR',
    receiver: 'RECIEVER',
  };

  // set my role
  let myRole = roles.pending;

  // you can specify a STUN server here
  const iceConfiguration = {};
  iceConfiguration.iceServers = [];
  // turn server
  iceConfiguration.iceServers.push({
    // new coturn STUN/TURN
    urls: 'turn:104.153.154.109',
    username: 'teamswell',
    credential: 'cohortla44',
    credentialType: 'password',
  });
  // stun  server
  iceConfiguration.iceServers.push(
    {
      urls: 'stun:stun1.l.google.com:19302',
    },
    {
      urls: 'stun:104.153.154.109',
    }
  );

  // create peer connections as instances of RTCPeerConnection
  const pcInitiator = new RTCPeerConnection(iceConfiguration);
  const pcReceiver = new RTCPeerConnection(iceConfiguration);

  // listen for ICE candidates.  Each time a candidate is added to the list, re-log the whole SDP
  pcInitiator.onicecandidate = (event) => displayLocalSDP(event);
  pcReceiver.onicecandidate = (event) => displayLocalSDP(event);

  // log and display Local SDP (ICE candidates)
  function displayLocalSDP(event) {
    console.log(`displayLocalSDP: incoming event:`);
    console.log(event);

    if (
      event &&
      event.target &&
      event.target.iceGatheringState === 'complete'
    ) {
      console.log('done gathering candidates - got iceGatheringState complete');
    } else if (event && event.candidate == null) {
      console.log('done gathering candidates - got null candidate');
    } else {
      console.log(
        event.target.iceGatheringState,
        event,
        event.target.localDescription
      );
      console.log('corresponding SDP for above ICE candidate in JSON:');
      console.log(JSON.stringify(event.target.localDescription));
      // display the newly created SDP in the Local SDP textarea on the DOM
      const localSDP = JSON.stringify(event.target.localDescription);
      localSdpDisplay.textContent = localSDP; // DOM element
    }
  } // end of displayLocalSDP()

  // INITIATOR CHANNELS -- setup data channel and channel events for ==> pcInitiator
  const dataChannel = pcInitiator.createDataChannel('chatRoom1');
  // when the channel is openned ...
  dataChannel.onopen = (event) => {
    console.log('Connection opened!');
    enableMessaging();
  };
  // when the channel is closed ...
  dataChannel.onclose = (event) =>
    console.log('Connection closed! Goodbye (^-^)');
  // when message received...
  dataChannel.onmessage = (event) => {
    console.log(`incoming msg: ${event.data}`);
    postMessageToLocalDisplay(event.data, true);
  };

  // RECEIVER CHANNELS -- wait for channel creation and then set channel events for ==> pcReceiver
  pcReceiver.ondatachannel = (event) => {
    // create new property on rc object and assign it to be the incoming data channel (*** is this the name that was passed in by the local client? ***)
    const incommingChannel = event.channel;
    pcReceiver.dataChannel = incommingChannel;
    // when the channel is openned ...
    // remoteConnection.dataChannel.onopen = event => console.log("Connection opened!");
    pcReceiver.dataChannel.onopen = (event) => {
      console.log('Connection opened!');
      enableMessaging();
    };
    // when the channel is closed ...
    // remoteConnection.dataChannel.onclose = event => console.log("Connection closed! Goodbye (^-^)");
    pcReceiver.dataChannel.onclose = (event) =>
      console.log('Connection closed! Goodbye (^-^)');
    // when message received...
    // remoteConnection.dataChannel.onmessage = event => console.log("PeerA: " + event.data);
    pcReceiver.dataChannel.onmessage = (event) => {
      console.log(`incoming msg: ${event.data}`);
      postMessageToLocalDisplay(event.data, true);
    };
  };

  function enableMessaging() {
    btnSendMessage.disabled = false;
    inputMessage.placeholder = 'New message here ...';
  }

  // SET LOCAL SDP
  function setLocalSDP() {
    if (myRole === roles.pending) myRole = roles.initiator;
    console.log('myRole is now ', myRole);

    btnSetLocalSDP.disabled = true;

    pcInitiator
      .createOffer()
      .then((offer) => pcInitiator.setLocalDescription(offer))
      .then((a) => console.log('offer set successfully!'));
  }

  // SET REMOTE SDP
  function setRemoteSDP() {
    if (myRole === roles.pending) {
      myRole = roles.receiver;

      // disable the LocalSDP button on the DOM
      btnSetLocalSDP.disabled = true;
    }

    // disable the RemoteSDP button on the DOM
    btnSetRemoteSDP.disabled = true;

    // get the remote SDP from the textarea on the DOM
    const remoteSDP = JSON.parse(inputRemoteSDP.value);

    console.log('remote SDP:');
    console.log(remoteSDP);

    if (myRole === roles.receiver) {
      // set remote description to be client-A's offer

      pcReceiver
        .setRemoteDescription(remoteSDP)
        .then((a) => console.log('remoteSDP (offer) set!'));

      // generate localSDPs and set to local description.  This should be handed to the remote peer for signaling
      pcReceiver
        .createAnswer()
        .then((answer) => pcReceiver.setLocalDescription(answer))
        .then((a) => {
          console.log('answer created!');
        });
    } else if (myRole === roles.initiator) {
      pcInitiator
        .setRemoteDescription(remoteSDP)
        .then((a) => console.log('remoteSDP (answer) set!'));
    }
  }

  // SEND MESSAGE
  function sendMessage() {
    // grab message text from DOM
    const message = inputMessage.value;
    console.log('outgoing msg: ', message);

    if (myRole === roles.initiator) {
      dataChannel.send(message);

      postMessageToLocalDisplay(message, false);

      // reset the text input field
      inputMessage.value = '';

      pcInitiator
        .getStats()
        .then((stats) => console.log('Stats: \n', stats))
        .catch();
    } else if (myRole === roles.receiver) {
      pcReceiver.dataChannel.send(message);

      postMessageToLocalDisplay(message, false);

      // reset the text input field
      inputMessage.value = '';

      pcReceiver
        .getStats()
        .then((stats) => console.log('Stats: \n', stats))
        .catch();
    } else {
      console.log(`Messages cannot be sent while your role is ${myRole}`);
    }
  }

  function postMessageToLocalDisplay(message, bIncoming) {
    // build new message item
    const messageItem = document.createElement('div');
    messageItem.innerText = message;

    const messageItemWrapper = document.createElement('div');
    messageItemWrapper.setAttribute('class', 'message-wrapper');

    // create class description based on whether this is an incoming or outgoing message
    let msgClass;
    if (bIncoming) msgClass = 'message-item incoming';
    else msgClass = 'message-item outgoing';
    messageItem.setAttribute('class', msgClass);

    messageItemWrapper.appendChild(messageItem);

    messageDisplay.appendChild(messageItemWrapper);
  }

  // EVENT LISTENERS
  // body.addEventListener('keydown', changeHeadDirection);
  btnSetLocalSDP.addEventListener('click', setLocalSDP);
  btnSetRemoteSDP.addEventListener('click', setRemoteSDP);
  btnSendMessage.addEventListener('click', sendMessage);

  // ========= MAIN LOGIC ========== //
});
