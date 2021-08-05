// /* eslint-disable camelcase */
// import * as store from '../store';
// import * as actions from '../actions/actions';

// const { api } = window;

// // define roles
// const roles = {
//   pending: 'PENDING',
//   initiator: 'INITIATOR',
//   receiver: 'RECEIVER',
// };

// // set my role
// const myRole = roles.pending;

// // Server configuration
// const iceConfiguration = {};
// iceConfiguration.iceServers = [
//   {
//     urls: 'turn:104.153.154.109',
//     username: 'teamswell',
//     credential: 'cohortla44',
//     credentialType: 'password',
//   },
//   {
//     urls: 'stun:stun1.l.google.com:19302',
//   },
//   {
//     urls: 'stun:104.153.154.109',
//   },
// ];

// const pcInitiator = new RTCPeerConnection(iceConfiguration);
// const pcReceiver = new RTCPeerConnection(iceConfiguration);

// let pc;

// const webrtcController = {
//   openWebrtcConnection(reqResObj, connectionArray) {
//     console.log(`webrtcController.openWebrtcConnection`);

//     // set reqResObj for webrtc
//     reqResObj.response.messages = [];
//     reqResObj.request.messages = [];
//     reqResObj.connection = 'pending';
//     reqResObj.closeCode = 0;
//     reqResObj.timeSent = Date.now();

//     reqResObj.connection = 'connected';
//     console.log(pcInitiator);
//   },
//   setLocalSDP(content) {
//     console.log('setLocalSDP');
//     console.log('[setLocalSDP] pcInitiator config:');
//     console.log(JSON.stringify(pcInitiator.getConfiguration()));
//     console.log(content.webrtcData);
//     pcInitiator
//       .createOffer()
//       .then((offer) => {
//         pcInitiator.setLocalDescription(offer);
//       })
//       .then((a) => {
//         console.log('[setLocalSDP] offer set successfully!');
//         content.webrtcData.localSdp = JSON.stringify(
//           pcInitiator.localDescription
//         );
//         console.log(
//           '[setLocalSDP] webrtcData.localSdp: (stringified)\n',
//           JSON.stringify(content.webrtcData.localSdp)
//         );
//         store.default.dispatch(actions.saveCurrentResponseData(content));
//         // store.default.dispatch(actions.reqResUpdate(newReqRes));
//       });
//     pcInitiator.onicecandidate = (event) => console.log(event);
//   },
//   displayLocalSDP(event) {
//     // console.log('new ICE candidate:\n', event.target.localDescription);
//   },
// };

// export default webrtcController;
