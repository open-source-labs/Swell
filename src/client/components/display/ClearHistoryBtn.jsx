import React, { useEffect } from 'react';
import historyController from '../../controllers/historyController';

// utilizing API we created in preload.js for node-free IPC communication
const { api } = window;

const ClearHistoryBtn = (props) => {
  // cleanup api.receive event listener on dismount
  useEffect(() => {
    api.receive('clear-history-response', (res) => {
      // a response of 0 from main means user has selected 'confirm'
      if (res.response === 0) {
        historyController.clearHistoryFromIndexedDb();
        props.clearHistory();
      }
    });
  }, []);

  const handleClick = () => {
    api.send('confirm-clear-history');
  };
  return (
    <button
      className="ml-0 mt-3 mb-3 button is-small is-primary is-outlined button-padding-verticals"
      onClick={handleClick}
    >
      Clear History
    </button>
  );
};

export default ClearHistoryBtn;
