import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../toolkit-refactor/store';
import { stepperClasses } from '@mui/material';
import {
  $TSFixMe,
  ReqRes,
  RequestWebRTCText,
  ResponseWebRTCText,
  WebMessages,
} from '../../../../../types';
import WebRTCTextItem from './WebRTCTextItem';
import { useDispatch } from 'react-redux';
import { responseDataSaved } from '../../../../toolkit-refactor/slices/reqResSlice';

const WebRTCTextContainer = () => {
  const dispatch = useDispatch();
  const [messageInput, setMessageInput] = useState('');

  const currentReqRes = useSelector(
    (store: RootState) => store.reqRes.currentResponse
  ) as ReqRes;

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

