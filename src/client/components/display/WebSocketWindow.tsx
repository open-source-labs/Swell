/* eslint-disable no-param-reassign */
import React, { useState } from "react";
import PropTypes, { string } from "prop-types";
import { useSelector, useDispatch } from 'react-redux';
import WebSocketMessage from "./WebSocketMessage";
import { WebSocketWindowProps } from "../../../types"
import ReqResCtrl from "../../controllers/reqResController";
import * as actions from "../../../../src/client/actions/actions.js";

const { api } = window;

const WebSocketWindow :React.SFC<WebSocketWindowProps> = ({ content, outgoingMessages, incomingMessages, connection }) => {

  const [inputMessage, setInputMessage] = useState('');
  const [showCloseButton, setShowCloseButton] = useState('open');

  //updates the outgoing message when it changes
  const updateOutgoingMessage = (value: string) => {
    setInputMessage(value);
  }
  
  //sends to WScontroller in main.js to send the message to server
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
  //maps the messages to view in chronological order and by whom - self/server
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
    const messageInputStyles = {
      display: connection === "open" ? "block" : "none",
    };

    return (
      <div style={{}} className="websocket_container is-tall is-flex is-flex-direction-column">
        <div style={messageInputStyles} className="websocket_input">
          <input
            className="ml-1 input input-is-medium"
            value={inputMessage}
            onKeyPress={handleKeyPress}
            placeholder="Message"
            onChange={(e) => updateOutgoingMessage(e.target.value)}
          />
          <button
          
            className="button is-small is-primary is-outlined button-padding-verticals mx-3"
            // onClick={sendToWSController}
            // className="websocket_input-btn"
            onClick={() => {
              setShowCloseButton("open");
              sendToWSController();
            }}
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
        { showCloseButton === 'open' &&
          <div className="is-3rem-footer ml-3 mr-3">
            <button
              className="button is-normal is-fullwidth is-primary-100 is-button-footer is-margin-top-auto add-request-button"
              onClick={() => { 
                setShowCloseButton("closed");
                ReqResCtrl.closeReqRes(content.id);
                return;
              }}
              type="button"
            >
              Close Connection
            </button>
          </div>
        }
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
