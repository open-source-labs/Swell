/* eslint-disable no-param-reassign */
import React, { useState } from "react";
import PropTypes, { string } from "prop-types";
import { useSelector, useDispatch } from 'react-redux';
import WebSocketMessage from "./WebSocketMessage";
import { WebSocketWindowProps } from "../../../types"
import * as actions from "../../../../src/client/actions/actions.js";

const { api } = window;

const WebSocketWindow :React.SFC<WebSocketWindowProps> = ({ content, outgoingMessages, incomingMessages, connection }) => {

  const [inputMessage, setInputMessage] = useState('');
  const [showWarning, setShowWarning] =useState(false)

  //updates the outgoing message when it changes
  const updateOutgoingMessage = (value: any) => {
    setInputMessage(value);
  }
  
  //sends to WScontroller in main.js to send the message to server
  const sendToWSController = () =>  {
    api.send("send-ws", content, inputMessage);
    //reset inputbox
    // setInputMessage('');
  }

  const onFileChange = async (event:any)=>{
    
    const file = event.target.files[0]
    console.log('file===>',file)
    console.log('size==>', file.size)
    file.size>100000 ?
      setShowWarning(true):
      setShowWarning(false)
    

    
    //const imageSrc = URL.createObjectURL(file)

    const dataURL = (file:any) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});
    
     const data:any = await dataURL(file);
     
    // const buffer = Buffer.from(data, "utf8");
    // console.log(buffer)
    
 
    updateOutgoingMessage(data) //file is 
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
      //conditionally rendering messages or images
      .map((message, index) => (
        
        <WebSocketMessage
          key={index}
          index={index}
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
      <div style={{}} className="websocket_container is-tall is-flex is-flex-direction-column m-3">
        <div className="is-flex is-align-items-center">
          <input
            className="ml-1 mr-1 input is-small"
            
            value={inputMessage}
            onKeyPress={handleKeyPress}
            placeholder="Message"
            onChange={(e) => updateOutgoingMessage(e.target.value)}
          />
          <button
            className="button is-primary is-outlined is-small"
            onClick={sendToWSController}
            type="button"
          >
            Send Message
          </button>
          <input
            className="ml-1 mr-1 input is-small"
            type='file'
            //value={inputMessage}
            onKeyPress={handleKeyPress}
            //placeholder="Message"
            onChange={onFileChange}
            // onChange={(e) => updateOutgoingMessage(e.target.value)}
          />
          <button
            className="button is-primary is-outlined is-small"
            onClick={sendToWSController}
            type="button"
          >
            Send image
          </button>

           
          {showWarning? 
          <p >file size is large, may cause errors</p>: null}

        </div>
        {/* only show the ws messages when connection is open */}
        {connection === "open" && (
          <div className="overflow-parent-container">
            <div className="websocket_message_container m-3">
              {combinedMessagesReactArr}
            </div>
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
