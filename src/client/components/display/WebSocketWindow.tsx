/* eslint-disable no-param-reassign */
import React, { useState } from "react";
import PropTypes, { string } from "prop-types";
import WebSocketMessage from "./WebSocketMessage.jsx";
import { WebSocketWindowProps } from "../../../types"

const { api } = window;

const WebSocketWindow :React.SFC<WebSocketWindowProps> = ({ 
  content,
  outgoingMessages,
  incomingMessages,
  connection
 }) => {
  const [inputMessage, setInputMessage] = useState('');

  //updates the outgoing message when it changes
  const updateOutgoingMessage = (value: string) => {
    setInputMessage(value);
  }
  
  //sends to WScontroller to send the message
  const sendToWSController = () =>  {
    api.send("send-ws", content, inputMessage);
    //reset inputbox
    setInputMessage('');
  }

  //when you press enter send the message, send message to socket
  const handleKeyPress = (event: {key: string}) => {
    if (event.key === "Enter") {
      sendToWSController();
    }
  }

  //maps the messages to view in chronological order and by whom
  const combinedMessagesReactArr = outgoingMessages
      .map((message) => {
        message.source = "client";
        return message;
      })
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
            value={inputMessage}
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
        {/* only show the ws messages when connection is open */}
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
  content: PropTypes.any.isRequired,
  connection: PropTypes.string.isRequired,
};

export default WebSocketWindow;
