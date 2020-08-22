/* eslint-disable no-param-reassign */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import WebSocketMessage from "./WebSocketMessage.jsx";
import wsController from "../../controllers/wsController";

const WebSocketWindow = props => {
  const [outgoingMessage, setOutgoingMessage] = useState('');
  const { id, outgoingMessages, incomingMessages, connection } = props

  //updates the outgoing message when it changes
  const updateOutgoingMessage = (value) => {
    setOutgoingMessage(value);
  }
  
  //sends to WScontroller to send the message
  const sendToWSController = () =>  {
    wsController.sendWebSocketMessage(
      id,
      outgoingMessage
    );
    //resets the outgoing message textbox, did this twice???
    updateOutgoingMessage('');
    // document.querySelector(".websocket_input-text").value = "";
  }

  //when you press enter send the message
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      sendToWSController();
    }
  }

    //maps outgoing Messages, sets them as client,
  const combinedMessagesReactArr = outgoingMessages
      .map((message) => {
        message.source = "client";
        return message;
      })
      //and combines to one array by 
      //maps incoming messages, sets them to server 
      .concat(
        incomingMessages.map((message) => {
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
      display: connection === "open" ? "block" : "none",
    };

    return (
      <div style={{}} className="websocket_container">
        <div style={messageInputStyles} className="websocket_input">
          <input
            className="websocket_input-text"
            value={outgoingMessage}
            onKeyPress={handleKeyPress}
            placeholder="Message"
            onChange={(e) => updateOutgoingMessage(e.target.value)}
          />

          <button
            className="websocket_input-btn"
            onClick={sendToWSController}
            type="button"
          >
            Send Message
          </button>
        </div>
        {/* when the connection is open, show the ws messages */}
        {connection === "open" && (
          <div className="websocket_message_container">
            {combinedMessagesReactArr}
          </div>
        )}
      </div>
    );
}

WebSocketWindow.propTypes = {
  outgoingMessages: PropTypes.array.isRequired,
  incomingMessages: PropTypes.array.isRequired,
  id: PropTypes.any.isRequired,
  connection: PropTypes.string.isRequired,
};

export default WebSocketWindow;
