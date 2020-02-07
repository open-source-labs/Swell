import React, { Component } from 'react';
import PropTypes from 'prop-types';

class WebSocketMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const styles = {
      display: 'flex',
      overflow: 'hidden',
      justifyContent: this.props.source === 'server' ? 'flex-start' : 'flex-end',
    };

    const webSocketMessageClassNames =  this.props.source === 'server' ? 'websocket_message websocket_message-server' : 'websocket_message websocket_message-client'
    let hours = new Date(this.props.timeReceived).getHours();
    let minutes = new Date(this.props.timeReceived).getMinutes();

    hours = hours >= 10 ? `${hours}` : `0${JSON.stringify(hours)}`
    minutes = minutes >= 10 ? `${minutes}` : `0${JSON.stringify(minutes)}`

    return (
      <div style={styles} className={webSocketMessageClassNames}>
        <div style={styles} className={'websocket_message-data'}><div>{this.props.data}</div></div>
        <div  className={'websocket_message-time'}>{`${hours}:${minutes}`}</div>
      </div>
    );
  }
}

WebSocketMessage.propTypes = {
  source: PropTypes.string.isRequired,
  data: PropTypes.any.isRequired,
  timeReceived: PropTypes.any.isRequired,
};

export default WebSocketMessage;
