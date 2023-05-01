import React from 'react';

interface Props {
  currentResponse: {
    timeReceived?: number;
    timeSent?: number;
    response?: {
      messages?: any[];
    };
    request?: {
      messages?: any[];
    };
  };
}

function ResponseTime({ currentResponse }: Props) {
  if (
    currentResponse &&
    currentResponse.timeReceived &&
    currentResponse.timeSent
  ) {
    const responseTime =
      currentResponse.timeReceived - currentResponse.timeSent;

    return <div className="response-time-placement">{`${responseTime}ms`}</div>;
  }

  //websocket:
  if (
    currentResponse &&
    currentResponse.response &&
    currentResponse.response.messages &&
    currentResponse.request?.messages &&
    currentResponse.response.messages.length > 0 &&
    currentResponse.response.messages.length ===
      currentResponse.request.messages.length
  ) {
    const leng = currentResponse.request.messages.length;
    const requestTime = currentResponse.request.messages[leng - 1].timeReceived;

    const responseTime =
      currentResponse.response.messages[leng - 1].timeReceived;

    const lagTime = responseTime - requestTime;
    return <div className="response-time-placement">{`${lagTime}ms`}</div>;
  }

  return null;
}

export default ResponseTime;