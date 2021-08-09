// /* eslint-disable react-hooks/exhaustive-deps */
// import React, { Fragment, useState, useEffect, useRef } from 'react';
// // import {
// //   Header,
// //   Icon,
// //   Input,
// //   Grid,
// //   Segment,
// //   Button,
// //   Loader
// // } from "semantic-ui-react";
// // import SweetAlert from "react-bootstrap-sweetalert";
// // import { format } from "date-fns";
// // import "./App.css";
// // import UsersList from "./UsersList";
// // import MessageBox from "./MessageBox";

// // Use for remote connections
// const configuration = {
//   iceServers: [{ url: 'stun:stun.1.google.com:19302' }],
// };

// // Use for local connections
// // const configuration = null;

// const Chat = () => {
//   const [connection, setconnection] = useState(null);
//   const [channel, setChannel] = useState(null);
//   const [socketOpen, setSocketOpen] = useState(false);
//   const [socketMessages, setSocketMessages] = useState([]);
//   const [name, setName] = useState('');
//   const [loggingIn, setLoggingIn] = useState(false);
//   const [users, setUsers] = useState([]);
//   const [connectedTo, setConnectedTo] = useState('');
//   const [connecting, setConnecting] = useState(false);
//   const connectedRef = useRef();
//   const webSocket = useRef(null);
//   const [message, setMessage] = useState('');
//   const messagesRef = useRef({});
//   const [messages, setMessages] = useState({});

//   const updateConnection = (conn) => {
//     setconnection(conn);
//   };
//   const updateChannel = (chn) => {
//     setChannel(chn);
//   };

//   useEffect(() => {
//     webSocket.current = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
//     webSocket.current.onmessage = (message) => {
//       const data = JSON.parse(message.data);
//       setSocketMessages((prev) => [...prev, data]);
//     };
//     webSocket.current.onclose = () => {
//       webSocket.current.close();
//     };
//     return () => webSocket.current.close();
//   }, []);

//   useEffect(() => {
//     const data = socketMessages.pop();
//     if (data) {
//       switch (data.type) {
//         case 'connect':
//           setSocketOpen(true);
//           break;
//         case 'login':
//           onLogin(data);
//           break;
//         case 'updateUsers':
//           updateUsersList(data);
//           break;
//         case 'removeUser':
//           removeUser(data);
//           break;
//         case 'offer':
//           onOffer(data);
//           break;
//         case 'answer':
//           onAnswer(data);
//           break;
//         case 'candidate':
//           onCandidate(data);
//           break;
//         default:
//           break;
//       }
//     }
//   }, [onAnswer, onCandidate, onLogin, onOffer, socketMessages]);

//   const send = (data) => {
//     webSocket.current.send(JSON.stringify(data));
//   };

//   const handleLogin = () => {
//     setLoggingIn(true);
//     send({
//       type: 'login',
//       name,
//     });
//   };

//   const updateUsersList = ({ user }) => {
//     setUsers((prev) => [...prev, user]);
//   };

//   const removeUser = ({ user }) => {
//     setUsers((prev) => prev.filter((u) => u.userName !== user.userName));
//   };

//   const handleDataChannelMessageReceived = ({ data }) => {
//     const message = JSON.parse(data);
//     const { name: user } = message;
//     const messages = messagesRef.current;
//     let userMessages = messages[user];
//     if (userMessages) {
//       userMessages = [...userMessages, message];
//       const newMessages = { ...messages, [user]: userMessages };
//       messagesRef.current = newMessages;
//       setMessages(newMessages);
//     } else {
//       const newMessages = { ...messages, [user]: [message] };
//       messagesRef.current = newMessages;
//       setMessages(newMessages);
//     }
//   };

//   const onLogin = ({ success, message, users: loggedIn }) => {
//     setLoggingIn(false);
//     if (success) {
//       console.log('object');
//       setIsLoggedIn(true);
//       setUsers(loggedIn);
//       const localConnection = new RTCPeerConnection(configuration);
//       //when the browser finds an ice candidate we send it to another peer
//       localConnection.onicecandidate = ({ candidate }) => {
//         const connectedTo = connectedRef.current;

//         if (candidate && !!connectedTo) {
//           send({
//             name: connectedTo,
//             type: 'candidate',
//             candidate,
//           });
//         }
//       };
//       localConnection.ondatachannel = (event) => {
//         console.log('Data channel is created!');
//         const receiveChannel = event.channel;
//         receiveChannel.onopen = () => {
//           console.log('Data channel is open and ready to be used.');
//         };
//         receiveChannel.onmessage = handleDataChannelMessageReceived;
//         updateChannel(receiveChannel);
//       };
//       updateConnection(localConnection);
//     } else {
//       setAlert(
//         <SweetAlert
//           warning
//           confirmBtnBsStyle="danger"
//           title="Failed"
//           onConfirm={closeAlert}
//           onCancel={closeAlert}
//         >
//           {message}
//         </SweetAlert>
//       );
//     }
//   };

//   //when somebody wants to message us
//   const onOffer = ({ offer, name }) => {
//     setConnectedTo(name);
//     connectedRef.current = name;

//     connection
//       .setRemoteDescription(new RTCSessionDescription(offer))
//       .then(() => connection.createAnswer())
//       .then((answer) => connection.setLocalDescription(answer))
//       .then(() =>
//         send({ type: 'answer', answer: connection.localDescription, name })
//       )
//       .catch((e) => {
//         console.log({ e });
//       });
//   };

//   //when another user answers to our offer
//   const onAnswer = ({ answer }) => {
//     connection.setRemoteDescription(new RTCSessionDescription(answer));
//   };

//   //when we got ice candidate from another user
//   const onCandidate = ({ candidate }) => {
//     connection.addIceCandidate(new RTCIceCandidate(candidate));
//   };

//   //when a user clicks the send message button
//   const sendMsg = () => {
//     const time = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
//     const text = { time, message, name };
//     const messages = messagesRef.current;
//     const connectedTo = connectedRef.current;
//     let userMessages = messages[connectedTo];
//     if (messages[connectedTo]) {
//       userMessages = [...userMessages, text];
//       const newMessages = { ...messages, [connectedTo]: userMessages };
//       messagesRef.current = newMessages;
//       setMessages(newMessages);
//     } else {
//       userMessages = { ...messages, [connectedTo]: [text] };
//       messagesRef.current = userMessages;
//       setMessages(userMessages);
//     }
//     channel.send(JSON.stringify(text));
//     setMessage('');
//   };

//   const handleConnection = (name) => {
//     const dataChannelOptions = {
//       reliable: true,
//     };

//     const dataChannel = connection.createDataChannel('messenger');

//     dataChannel.onerror = (error) => {
//       console.log(error);
//     };

//     dataChannel.onmessage = handleDataChannelMessageReceived;
//     updateChannel(dataChannel);

//     connection
//       .createOffer()
//       .then((offer) => connection.setLocalDescription(offer))
//       .then(() =>
//         send({ type: 'offer', offer: connection.localDescription, name })
//       )
//       .catch((e) => console.log({ e }));
//   };

//   const toggleConnection = (userName) => {
//     if (connectedRef.current === userName) {
//       setConnecting(true);
//       setConnectedTo('');
//       connectedRef.current = '';
//       setConnecting(false);
//     } else {
//       setConnecting(true);
//       setConnectedTo(userName);
//       connectedRef.current = userName;
//       handleConnection(userName);
//       setConnecting(false);
//     }
//   };
//   return (
//     <div className="App">
//       {alert}
//       <Header as="h2" icon>
//         <Icon name="users" />
//         Simple WebRTC Chap App
//       </Header>
//       {(socketOpen && (
//         <>
//           <Grid centered columns={4}>
//             <Grid.Column>
//               {(!isLoggedIn && (
//                 <Input
//                   fluid
//                   disabled={loggingIn}
//                   type="text"
//                   onChange={(e) => setName(e.target.value)}
//                   placeholder="Username..."
//                   action
//                 >
//                   <input />
//                   <Button
//                     color="teal"
//                     disabled={!name || loggingIn}
//                     onClick={handleLogin}
//                   >
//                     <Icon name="sign-in" />
//                     Login
//                   </Button>
//                 </Input>
//               )) || (
//                 <Segment raised textAlign="center" color="olive">
//                   Logged In as: {name}
//                 </Segment>
//               )}
//             </Grid.Column>
//           </Grid>
//           <Grid>
//             <UsersList
//               users={users}
//               toggleConnection={toggleConnection}
//               connectedTo={connectedTo}
//               connection={connecting}
//             />
//             <MessageBox
//               messages={messages}
//               connectedTo={connectedTo}
//               message={message}
//               setMessage={setMessage}
//               sendMsg={sendMsg}
//               name={name}
//             />
//           </Grid>
//         </>
//       )) || (
//         <Loader size="massive" active inline="centered">
//           Loading
//         </Loader>
//       )}
//     </div>
//   );
// };

// export default Chat;
