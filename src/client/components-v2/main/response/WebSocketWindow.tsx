/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-param-reassign */
import React, { useState } from 'react';
import PropTypes from 'prop-types';

const { api } = window;

// TODO: ResponsePaneContainer.tsx should dispach state and we should pull it here, not drill it down
const WebSocketWindow = ({content, outgoingMessages, incomingMessages, connection}) => {
  const [inputFields, setInputFields] = useState({
    msg: '',
    image: '',
  });

  // updates the outgoing message when it changes
  const updateOutgoingMessage = (value: any) => {
    console.log('updating msg');
    if (value.includes('data:image/')) {
      setInputFields({ ...inputFields, image: value });
    } else {
      setInputFields({ ...inputFields, msg: value });
    }
  };

  // sends to WScontroller in main.js to send the message to server
  // TODO: doesn't handle the case of both fields being populated
  const sendToWSController = () => {
    if (inputFields.msg) {
      api.send('send-ws', content, inputFields.msg);
      setInputFields({ msg: '', image: '' });
    } else if (inputFields.image) {
      console.log('rerendering');
      api.send('send-ws', content, inputFields.image);
      setInputFields({ msg: '', image: '' });
    }
    // reset inputbox
  };

  const handleFileChange = async (file: any) => {
    const img = file[0];

    const dataURL = (file: any) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(img);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });

    const data: any = await dataURL(img);
    if (inputFields.image !== data) {
      updateOutgoingMessage(data);
    }
  };

  // when you press enter send the message, send message to socket
  const handleKeyPress = (event: { key: string }) => {
    if (event.key === 'Enter') {
      sendToWSController();
    }
  };
  // maps the messages to view in chronological order and by whom - self/server
  const combinedMessagesReactArr = outgoingMessages
    .map((message: Record<string, unknown>) => {
      message = {...message, source: 'client'}  
      console.log('message after', message)
      return message;
    })
    .concat(
      incomingMessages.map((message: Record<string, unknown>) => {
        message = {...message, source: 'server'}  
        return message;
      })
    )
    // sorts by time
    .sort((a, b) => a.timeReceived - b.timeReceived)
    // then maps the combined array to a WebSocket Component
    // conditionally rendering messages or images
    .map((message, index) => (
      <WebSocketMessage
        key={index}
        index={index}
        source={message.source}
        data={message.data}
        timeReceived={message.timeReceived}
      />
    ));

  // sets the message style depending on if the connection is open
  // hides when connection is not open
  const messageInputStyles = {
    display: connection === 'open' ? 'block' : 'none',
  };

  // exports the chatLog- sends it to the backend
  const exportChatLog = (event: any) => {
    api.send('exportChatLog', outgoingMessages, incomingMessages);
  };

  return (
    <div className="websocket_container is-tall is-flex is-flex-direction-column p-3">
      <div className="is-flex is-align-items-center">
        <input
          className="ml-1 mr-1 input is-small"
          id="wsMsgInput"
          value={inputFields.msg}
          onKeyPress={handleKeyPress}
          placeholder="Message"
          onChange={(e) => updateOutgoingMessage(e.target.value)}
        />
        <button
          className="button is-primary is-outlined is-small"
          id="wsSendMsgBtn"
          onClick={sendToWSController}
          type="button"
        >
          Send Message
        </button>
      </div>
      <div className="is-flex is-align-items-center">
        <ImageDropzone onFileChange={handleFileChange} />
        <button
          className="button is-primary is-outlined is-small"
          id="wsSendImgBtn"
          onClick={sendToWSController}
          type="button"
        >
          Send image
        </button>
      </div>

      {/* only show the ws messages when connection is open */}
      {connection === 'open' && (
        <>
          <div className="websocket_message_container m-3">
            {combinedMessagesReactArr}
          </div>

          <button
            className="button is-primary is-outlined is-small"
            onClick={exportChatLog}
            type="button"
          >
            Export Log
          </button>
        </>
      )}
    </div>
  );
};

WebSocketWindow.propTypes = {
  outgoingMessages: PropTypes.array.isRequired,
  incomingMessages: PropTypes.array.isRequired,
  content: PropTypes.any.isRequired,
  connection: PropTypes.string.isRequired,
};

export default WebSocketWindow;

// This was separate file, maybe re-export eventually 

const WebSocketMessage = ({
  source,
  timeReceived,
  data,
  index,
}) => {
  // conditional classNames and id for messages for styling depending on source
  const webSocketMessageClassNames =
    source === 'server'
      ? 'websocket_message websocket_message-server'
      : 'websocket_message websocket_message-client';
  const webSocketMessageIDNames =
    source === 'server'
      ? 'id_websocket_message-server'
      : 'id_websocket_message-client';

  const message_background =
    source === 'server' ? 'server-background' : 'client-background';
  const message_sender = source === 'server' ? 'server' : 'client';

  // timestamp for messages
  const buildTime = (time: number): string => {
    const hours = new Date(time).getHours();
    const h = hours >= 10 ? `${hours}` : `0${JSON.stringify(hours)}`;
    const minutes = new Date(time).getMinutes();
    const m = minutes >= 10 ? `${minutes}` : `0${JSON.stringify(minutes)}`;
    const seconds = new Date(time).getSeconds();
    const s = seconds >= 10 ? `${seconds}` : `0${JSON.stringify(seconds)}`;
    return `${h}:${m}:${s}`;
  };

  return (
    <div>
      <div className={webSocketMessageClassNames} id={`ws-msg-${index}`}>
        <div className={message_background}>
          <div className="websocket_message-data">
            {typeof data === 'object' ? (
              // decode buffer to dataURI
              <img src={new TextDecoder('utf-8').decode(data)} alt="img" />
            ) : (
              <div id={webSocketMessageIDNames}>{data}</div>
            )}
          </div>
          <div className="websocket_message-time">
            {buildTime(timeReceived)}
          </div>
        </div>
      </div>
      <div className={message_sender}>{message_sender}</div>
    </div>
  );
};

WebSocketMessage.propTypes = {
  source: PropTypes.string.isRequired,
  data: PropTypes.any.isRequired,
  timeReceived: PropTypes.any.isRequired,
};

// This was separate file, maybe re-export eventually to

import { useDropzone } from 'react-dropzone';

function ImageDropzone({ onFileChange }) {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>image {file.name} uploaded</li>
  ));

  return (
    <section className="container">
      <div {...getRootProps({ className: 'dropzone' })}>
        <input id="wsFileInput" {...getInputProps()} />
        <input
          className="ml-1 mr-1 input is-small"
          id="wsDragNdrop"
          placeholder={`Drag 'n' drop your image here, or click to select a file`}
          onChange={() => {onFileChange(acceptedFiles)}}
        />
      </div>
      <aside>
        <ul>{files}</ul>
      </aside>
    </section>
  );
}
