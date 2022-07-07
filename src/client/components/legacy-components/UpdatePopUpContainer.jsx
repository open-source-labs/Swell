import React, { useEffect, useState } from 'react';

const { api } = window;

const UpdatePopUpContainer = () => {
  // Used to toggle the "update" pop-up.
  const [message, setMessage] = useState(null);

  useEffect(() => {
    api.receive('message', (e, text) => {
      console.log('AUTO-UPDATER STATUS: ' + e);
      if (text) setMessage(text);
    });
  });

  if (!message) {
    return null;
  }

  const handleUpdateClick = () => {
    api.send('quit-and-install');
    setMessage(null);
  };

  return (
    <div id="update-modal">
      <span>{message}</span>

      {message === 'Update downloaded.' && (
        <>
          <span className="updateMessage">
            Do you want to restart and install now? (If not, will auto-install
            on restart.)
          </span>
        </>
      )}

      <button
        className="button is-small modal-button"
        onClick={() => setMessage(null)}
      >
        Dismiss
      </button>

      {message === 'Update downloaded.' && (
        <button
          className="button is-small is-full-width modal-button-update"
          onClick={handleUpdateClick}
        >
          Update
        </button>
      )}
    </div>
  );
};

export default UpdatePopUpContainer;
