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
      justifyContent: this.props.source === 'server' ? 'flex-start' : 'flex-end',
    };

    const webSocketMessageClassNames =  this.props.source === 'server' ? 'websocket_message websocket_message-server' : 'websocket_message websocket_message-client'
    let time = new Date(this.props.timeReceived).getMinutes();
    time = (time < 10) ?
    `${new Date(this.props.timeReceived).getHours()}:0${JSON.stringify(time)}` :
    `${new Date(this.props.timeReceived).getHours()}:${JSON.stringify(time)}`;

    return (
      <div style={styles} className={webSocketMessageClassNames}>
        <div  className={'websocket_message-data'}>{this.props.data}</div>
        <div  className={'websocket_message-time'}>{time}</div>
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
