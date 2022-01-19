import React from 'react';

const SendRequestButton = ({ onClick }) => (
  <button
    className="button is-normal is-primary-100 add-request-button is-vertical-align-center is-justify-content-center no-border-please"
    onClick={onClick}
    type="button"
    style={{margin: '10px', paddingLeft: '32px', paddingRight: '32px'}}
  >
    Send Request
  </button>
);

export default SendRequestButton;