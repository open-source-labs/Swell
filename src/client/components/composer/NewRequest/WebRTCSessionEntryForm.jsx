import React from 'react';

const WebRTCSessionEntryForm = ({ warningMessage }) => {
  return (
    <div className="is-flex is-justify-content-center">
      <div id="webRTButton" className="button is-webrtc">
        <span>SDP</span>
      </div>
      <input
        className="ml-1 input input-is-medium is-info"
        type="text"
        placeholder="No url needed"
        disabled
      />
      {warningMessage.uri && (
        <div className="warningMessage">{warningMessage.uri}</div>
      )}
    </div>
  );
};

export default WebRTCSessionEntryForm;
