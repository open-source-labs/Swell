import React from 'react';
import { $TSFixMe } from '../../../../../types';

const WebRTCTextItem = (props: $TSFixMe) => {
  const { source, timeReceived, data } = props;
  const webSocketMessageClassNames =
    source === 'local'
      ? 'websocket_message websocket_message-client'
      : 'websocket_message websocket_message-server';
  const webSocketMessageIDNames =
    source === 'local'
      ? 'id_websocket_message-client'
      : 'id_websocket_message-server';

  const message_background =
    source === 'local' ? 'server-background' : 'client-background';
  const message_sender = source === 'local' ? 'localstream' : 'remotestream';

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
      <div className={webSocketMessageClassNames}>
        <div className={message_background}>
          <div id={webSocketMessageIDNames}>{data}</div>
          {buildTime(timeReceived)}
        </div>
      </div>
      <div className={message_sender}>{message_sender}</div>
    </div>
  );
};

export default WebRTCTextItem;

