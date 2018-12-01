/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import WebSocketMessage from './WebSocketMessage.jsx';
import wsController from '../../controllers/wsController';

class WebSocketWindow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      outgoingMessage: '',
    };
  }

  updateOutgoingMessage(value) {
    this.setState({
      outgoingMessage: value,
    });
  }

  render() {
    const combinedMessagesReactArr = this.props.outgoingMessages
      .map((message) => {
        message.source = 'client';
        return message;
      })
      .concat(
        this.props.incomingMessages.map((message) => {
          message.source = 'server';
          return message;
        }),
      )
      .sort((a, b) => a.timeReceived - b.timeReceived)
      .map((message, index) => (
        <WebSocketMessage
          key={index}
          source={message.source}
          data={message.data}
          timeReceived={message.timeReceived}
        />
      ));

    const messageInputStyles = {
      display: this.props.connection === 'open' ? 'block' : 'none',
    };

    return (
      <div
        style={{
          border: '1px solid black',
          margin: '3px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={messageInputStyles}>
          <input
            value={this.state.outgoingMessage}
            placeholder="Message"
            onChange={e => this.updateOutgoingMessage(e.target.value)}
          />

          <button
            onClick={() => wsController
              .sendWebSocketMessage(this.props.id, this.state.outgoingMessage)
            }
            type="button"
          >
            Send Message
          </button>
        </div>

        {combinedMessagesReactArr}
      </div>
    );
  }
}

WebSocketWindow.propTypes = {
  outgoingMessages: PropTypes.array.isRequired,
  incomingMessages: PropTypes.array.isRequired,
  id: PropTypes.any.isRequired,
  connection: PropTypes.string.isRequired,
};

export default WebSocketWindow;
