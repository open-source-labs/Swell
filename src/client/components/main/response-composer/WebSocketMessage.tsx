/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable camelcase */
import React from 'react';

interface WebSocketMessageProps {
  source: 'server' | 'client';
  data: 'ArrayBuffer' | 'ArrayBufferView';
  timeReceived: number;
  index: number;
}

const WebSocketMessage = ({
  source,
  timeReceived,
  data,
  index,
}: WebSocketMessageProps) => {
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

  const buildTime = (time: number): string => {
    const hours = new Date(time).getHours();
    const h = hours >= 10 ? `${hours}` : `0${JSON.stringify(hours)}`;
    const minutes = new Date(time).getMinutes();
    const m = minutes >= 10 ? `${minutes}` : `0${JSON.stringify(minutes)}`;
    const seconds = new Date(time).getSeconds();
    const s = seconds >= 10 ? `${seconds}` : `0${JSON.stringify(seconds)}`;
    return `${h}:${m}:${s}`;
  };

  const decodedData =
    typeof data === 'object' ? new TextDecoder('utf-8').decode(data) : data;

  return (
    <div>
      <div className={webSocketMessageClassNames} id={`ws-msg-${index}`}>
        <div className={message_background}>
          <div className="websocket_message-data">
            {typeof data === 'object' ? (
              // decode buffer to dataURI
              <img src={decodedData} alt="img" />
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

export default WebSocketMessage;

