/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { WebSocketMessageProps } from '../../../types';

const WebSocketMessage: React.SFC<WebSocketMessageProps> = ({
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

export default WebSocketMessage;
