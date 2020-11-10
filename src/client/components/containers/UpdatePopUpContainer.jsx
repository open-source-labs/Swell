import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

const { api } = window;

const UpdatePopUpContainer = ({ message, setMessage }) => {

  useEffect(()=>{
    api.receive("message", (e, text) => {
      console.log("AUTO-UPDATER STATUS: " + e);
      if (text) setMessage(text);
    });
  });

  const handleUpdateClick = () => {
    api.send("quit-and-install");
    setMessage(null);
  };

  return message ? (
    <div id="update-modal">
      <span>{message}</span>
      {message === "Update downloaded." && (
        <>
          <span className="updateMessage">
            Do you want to restart and install now? (If not, will
            auto-install on restart.)
          </span>
        </>
      )}
      <button className="button is-small modal-button" onClick={() => setMessage(null)}>
        Dismiss
      </button>
      {message === "Update downloaded." && (
        <button className="button is-small is-full-width modal-button-update" onClick={handleUpdateClick}>
          Update
        </button>
      )}
    </div>
  ) : null;
};

export default UpdatePopUpContainer;
