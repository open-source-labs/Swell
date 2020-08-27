import React from 'react';
import PropTypes from 'prop-types';

const WebSocketMessage = ({
  source,
  timeReceived,
  data
}) => {
  
  const styles = {
    display: 'flex',
    overflow: 'hidden',
    justifyContent: source === 'server' ? 'flex-start' : 'flex-end',
  };

  const webSocketMessageClassNames = source === 'server' ? 'websocket_message websocket_message-server' : 'websocket_message websocket_message-client'
  const webSocketMessageIDNames =  source === 'server' ? 'id_websocket_message-server' : 'id_websocket_message-client'
  let hours = new Date(timeReceived).getHours();
  let minutes = new Date(timeReceived).getMinutes();

  hours = hours >= 10 ? `${hours}` : `0${JSON.stringify(hours)}`
  minutes = minutes >= 10 ? `${minutes}` : `0${JSON.stringify(minutes)}`

  return (
    <div style={styles} className={webSocketMessageClassNames}>
      <div style={styles} className="websocket_message-data"><div id={webSocketMessageIDNames}>{data}</div></div>
      <div  className="websocket_message-time">{`${hours}:${minutes}`}</div>
    </div>
  );
}

WebSocketMessage.propTypes = {
  source: PropTypes.string.isRequired,
  data: PropTypes.any.isRequired,
  timeReceived: PropTypes.any.isRequired,
};

export default WebSocketMessage;
