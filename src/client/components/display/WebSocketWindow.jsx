/* eslint-disable no-param-reassign */
import React, { Component } from "react";
import PropTypes from "prop-types";
import WebSocketMessage from "./WebSocketMessage.jsx";
import wsController from "../../controllers/wsController";

class WebSocketWindow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      outgoingMessage: "",
    };
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.sendToWSController = this.sendToWSController.bind(this);
  }

  updateOutgoingMessage(value) {
    this.setState({
      outgoingMessage: value,
    });
  }
  handleKeyPress(event) {
    if (event.key === "Enter") {
      this.sendToWSController();
    }
  }
  sendToWSController() {
    wsController.sendWebSocketMessage(
      this.props.id,
      this.state.outgoingMessage
    );
    this.updateOutgoingMessage("");
    document.querySelector(".websocket_input-text").value = "";
  }

  render() {
    const combinedMessagesReactArr = this.props.outgoingMessages
      .map((message) => {
        message.source = "client";
        return message;
      })
      .concat(
        this.props.incomingMessages.map((message) => {
          message.source = "server";
          return message;
        })
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
      display: this.props.connection === "open" ? "block" : "none",
    };
    return (
      <div style={{}} className={"websocket_container"}>
        <div style={messageInputStyles} className={"websocket_input"}>
          <input
            className={"websocket_input-text"}
            value={this.state.outgoingMessage}
            onKeyPress={this.handleKeyPress}
            placeholder="Message"
            onChange={(e) => this.updateOutgoingMessage(e.target.value)}
          />

          <button
            className={"websocket_input-btn"}
            onClick={this.sendToWSController}
            type="button"
          >
            Send Message
          </button>
        </div>
        {this.props.connection === "open" && (
          <div className={"websocket_message_container"}>
            {combinedMessagesReactArr}
          </div>
        )}
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
