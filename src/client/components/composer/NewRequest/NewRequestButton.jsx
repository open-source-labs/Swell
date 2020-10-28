import React from 'react'

const NewRequestButton = ({ onClick }) => (
  <button
    className="button is-normal is-fullwidth is-primary-100 is-graph-footer add-request-button mt-1"
    onClick={onClick}
    type="button"
  >
    Add New Request
  </button>
);

export default NewRequestButton;