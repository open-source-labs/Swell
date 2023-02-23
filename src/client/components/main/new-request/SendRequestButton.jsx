import React from 'react';

const SendRequestButton = ({ onClick, buttonText }) => {
  return (
    <button
      className="button is-normal is-primary-100 add-request-button is-vertical-align-center is-justify-content-center no-border-please"
      onClick={onClick}
      type="button"
      style={{ margin: '10px', paddingLeft: '32px', paddingRight: '32px' }}
    >
      {buttonText || 'Send Request'}
    </button>
  );
};

export default SendRequestButton;
