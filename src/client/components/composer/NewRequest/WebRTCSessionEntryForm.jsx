/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useRef, useEffect } from 'react';
import dropDownArrow from '../../../../assets/icons/arrow_drop_down_white_192x192.png';

const WebRTCSessionEntryForm = ({
  warningMessage,
  setComposerWarningMessage,
  setNewRequestFields,
  newRequestFields,
}) => {
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
