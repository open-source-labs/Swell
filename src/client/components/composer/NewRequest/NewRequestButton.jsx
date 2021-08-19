import React from 'react';

const NewRequestButton = ({ onClick }) => (
  <button
    className="button is-normal is-fullwidth is-primary-100 is-button-footer is-margin-top-auto add-request-button is-vertical-align-center"
    onClick={onClick}
    type="button"
  >
    Add New Request
  </button>
);

export default NewRequestButton;
