import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../toolkit-refactor/store';
import { stepperClasses } from '@mui/material';
import {
  RequestWebRTC,
  RequestWebRTCText,
  ResponseWebRTCText,
  WebMessages,
} from '../../../../../types';
import WebRTCTextItem from './WebRTCTextItem';

const WebRTCTextLog = () => {
  const currentRequestWebRTCText = useSelector(
    (store: RootState) => store.reqRes.currentResponse.request
  ) as RequestWebRTCText;

  const currentResponseWebRTCText = useSelector(
    (store: RootState) => store.reqRes.currentResponse.response
  ) as ResponseWebRTCText;

  const messagesArr = currentRequestWebRTCText.webRTCMessages
    .map((message: WebMessages) => {
      return { ...message, source: 'request' };
    })
    .concat(
      currentResponseWebRTCText.webRTCMessages.map((message: WebMessages) => {
        return { ...message, source: 'response' };
      })
    )
    .sort((a, b) => a.timeReceived - b.timeReceived)
    .map((message, index) => {
      return (
        <WebRTCTextItem
          key={index}
          index={index}
          source={message.source as 'server' | 'client'}
          data={message.data as 'ArrayBuffer' | 'ArrayBufferView'}
          timeReceived={message.timeReceived}
        />
      );
    });

  return (
    <div className="is-tall is-flex is-flex-direction-column p-3">
      <div className="is-flex is-align-items-center">
        <input
          className="ml-1 mr-1 input is-small"
          placeholder="Message"
          onChange={() => console.log('tried to send message')}
        />
        <button
          className="button is-primary is-outlined is-small"
          id="wsSendMsgBtn"
          onClick={() => console.log('clicked "Send Message"')}
        >
          Send Message
        </button>
      </div>

      <div className="websocket_message_container m-3">
        {messagesArr}
      </div>
    </div>
  );
};

export default WebRTCTextLog;

