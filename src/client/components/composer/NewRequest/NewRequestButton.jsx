import React from 'react';

const NewRequestButton = ({ onClick }) => (
  <button
    className="button is-normal is-primary-100 add-request-button is-vertical-align-center is-justify-content-center no-border-please"
    onClick={onClick}
    type="button"
    style={{margin: '10px'}}
  >
    Add New Request
  </button>
);

export default NewRequestButton;
