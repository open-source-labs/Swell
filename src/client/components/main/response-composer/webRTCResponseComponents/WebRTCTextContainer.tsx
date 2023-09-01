import React, { useState } from 'react';

import { useAppSelector, useAppDispatch } from '../../../../rtk/store';
import { responseDataSaved } from '../../../../rtk/slices/reqResSlice';

import {
  type RequestWebRTCText,
  type ResponseWebRTCText,
  type WebMessages,
} from '~/types';

import { stepperClasses } from '@mui/material';
import WebRTCTextItem from './WebRTCTextItem';

const WebRTCTextContainer = () => {
  const dispatch = useAppDispatch();
  const [messageInput, setMessageInput] = useState('');

  const currentReqRes = useAppSelector((store) => store.reqRes.currentResponse);
  const { request, response } = currentReqRes as {
    request: RequestWebRTCText;
    response: ResponseWebRTCText;
  };

  const messagesArr = request.webRTCMessages
    .map((message: WebMessages) => {
      return { ...message, source: 'local' };
    })
    .concat(
      response.webRTCMessages.map((message: WebMessages) => {
        return { ...message, source: 'remote' };
      })
    )
    .sort((a, b) => a.timeReceived - b.timeReceived)
    .map((message, index) => {
      return (
        <WebRTCTextItem
          key={index}
          index={index}
          source={message.source as 'server' | 'client'}
          data={message.data}
          timeReceived={message.timeReceived}
        />
      );
    });

  const handleSubmit = () => {
    const newMessage = {
      data: messageInput,
      timeReceived: Date.now(),
    };

    dispatch(
      responseDataSaved({
        ...currentReqRes,
        request: {
          ...request,
          webRTCMessages: request.webRTCMessages.concat(newMessage),
        } as RequestWebRTCText,
      })
    );

    (
      document.getElementById('webrtc-message-input') as HTMLInputElement
    ).value = '';
    if (request.webRTCLocalStream) {
      request.webRTCLocalStream.send(JSON.stringify(messageInput));
    }
  };

  return (
    <div className="is-tall is-flex is-flex-direction-column p-3">
      <div className="is-flex is-align-items-center">
        <input
          className="ml-1 mr-1 input is-small"
          id="webrtc-message-input"
          placeholder="Message"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSubmit();
            }
          }}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <button
          className="button is-primary is-outlined is-small"
          type="submit"
          onClick={handleSubmit}
        >
          Send Message
        </button>
      </div>

      <div className="websocket_message_container mt-3">{messagesArr}</div>
    </div>
  );
};

export default WebRTCTextContainer;

