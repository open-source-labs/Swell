import React, { useState } from 'react';
import WebSocketMessage from './WebSocketMessage';
import {
  ConnectionStatus,
  ReqRes,
  ReqResRequest,
  ReqResResponse,
  WebsocketMessages,
  WindowExt,
} from '../../../../types';
import EmptyState from './EmptyState';

const { api } = window as unknown as WindowExt;

/**
 * @todo ResponsePaneContainer.tsx should dispach state and we should pull it
 * here, not drill it down
 */

const WebSocketWindow = ({ content }: { content: ReqRes }) => {
  const { request, response, connection } = content as {
    request: ReqResRequest;
    response: ReqResResponse;
    connection: ConnectionStatus;
  };
  if (
    !response ||
    !request ||
    !response.messages ||
    !response.messages ||
    connection !== 'open'
  ) {
    return <EmptyState connection={connection} />;
  }
  const outgoingMessages = request.messages as WebsocketMessages[];
  const incomingMessages = response.messages as WebsocketMessages[];
  const [inputMessage, setInputMessage] = useState('');

  // updates the outgoing message when it changes
  const updateOutgoingMessage = (value: any) => {
    setInputMessage(value);
  };

  const sendToWSController = () => {
    api.send('send-ws', content, inputMessage);
    setInputMessage('');
  };

  // when you press enter send the message, send message to socket
  const handleKeyPress = (event: { key: string }) => {
    if (event.key === 'Enter') {
      sendToWSController();
    }
  };
  // maps the messages to view in chronological order and by whom - self/server
  const combinedMessagesReactArr = outgoingMessages
    .map((message: WebsocketMessages) => {
      return { ...message, source: 'client' };
    })
    .concat(
      incomingMessages.map((message: WebsocketMessages) => {
        return { ...message, source: 'server' };
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
        source={message.source as 'server' | 'client'}
        data={message.data as 'ArrayBuffer' | 'ArrayBufferView'}
        timeReceived={message.timeReceived}
      />
    ));

  // exports the chatLog- sends it to the backend
  const exportChatLog = (): void => {
    api.send('exportChatLog', outgoingMessages, incomingMessages);
  };

  return (
    <div className="websocket_container is-tall is-flex is-flex-direction-column p-3">
      <div className="is-flex is-align-items-center">
        <input
          className="ml-1 mr-1 input is-small"
          id="wsMsgInput"
          value={inputMessage}
          onKeyDown={handleKeyPress}
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
    </div>
  );
};

export default WebSocketWindow;
