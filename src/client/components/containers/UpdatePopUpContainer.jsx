import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

const { api } = window;

const mapDispatchToProps = (dispatch) => ({});

const UpdatePopUpContainer = (props) => {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    api.receive("message", (e, text) => {
      console.log("AUTO-UPDATER STATUS: " + e);
      if (text) setMessage(text);
    });
  }, []);

  const handleUpdateClick = () => {
    api.send("quit-and-install");
    setMessage(null);
  };

  return message ? (
    <div id="update-modal" className="update_popup">
      <p>{message}</p>
      {message === "Update downloaded." && (
        <>
          <p className="updateMessage">
            Do you want to restart and install now? <br /> (If not, will
            auto-install on restart.)
          </p>
          <button className="button is-small" onClick={handleUpdateClick}>
            Update
          </button>
        </>
      )}
      <button className="button is-light is-small" onClick={() => setMessage(null)}>
        Dismiss
      </button>
    </div>
  ) : null;
};

export default connect(null, mapDispatchToProps)(UpdatePopUpContainer);
