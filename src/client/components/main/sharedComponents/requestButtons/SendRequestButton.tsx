import React from 'react';

const SendRequestButton = ({
  onClick,
  buttonText = 'Send Request',
}: {
  onClick: () => void;
  buttonText?: string;
}) => {
  return (
    <button
      className="button is-normal is-primary-100 add-request-button is-vertical-align-center is-justify-content-center no-border-please"
      onClick={onClick}
      type="button"
      id="send-request"
      style={{ margin: '10px', paddingLeft: '32px', paddingRight: '32px' }}
    >
      {buttonText}
    </button>
  );
};

export default SendRequestButton;

