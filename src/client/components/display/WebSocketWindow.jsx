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

  //updates the outgoing message when it changes
  updateOutgoingMessage(value) {
    this.setState({
      outgoingMessage: value,
    });
  }

  //when you press enter send the message
  handleKeyPress(event) {
    if (event.key === "Enter") {
      this.sendToWSController();
    }
  }

  //sends to WScontroller to send the message
  sendToWSController() {
    wsController.sendWebSocketMessage(
      this.props.id,
      this.state.outgoingMessage
    );
    //resets the outgoing message textbox, did this twice???
    this.updateOutgoingMessage("");
    // document.querySelector(".websocket_input-text").value = "";
  }

  render() {
    //maps outgoing Messages, sets them as client,
    const combinedMessagesReactArr = this.props.outgoingMessages
      .map((message) => {
        message.source = "client";
        return message;
      })
      //and combines to one array by 
      //maps incoming messages, sets them to server 
      .concat(
        this.props.incomingMessages.map((message) => {
          message.source = "server";
          return message;
        })
      )
      //sorts by time
      .sort((a, b) => a.timeReceived - b.timeReceived)
      //then maps the combined array to a WebSocket Component
      .map((message, index) => (
        <WebSocketMessage
          key={index}
          source={message.source}
          data={message.data}
          timeReceived={message.timeReceived}
        />
      ));
    
    //sets the message style depending on if the connection is open
    //hides when connection is not open
    //possible memory leak
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
        {/* when the connection is open, show the ws messages */}
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
