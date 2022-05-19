/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';

function SaveModalSavedWorkspaces({ name, inputID, updateCollection }) {
  return (
    <div>
      <div className="is-flex is-justify-content-space-between m-3">
        <div
          className="is-clickable is-primary-link is-align-items-center is-flex"
          onClick={() => {
            updateCollection(name, inputID);
          }}
        >
          {name}
        </div>
      </div>
    </div>
  );
}

export default SaveModalSavedWorkspaces;
