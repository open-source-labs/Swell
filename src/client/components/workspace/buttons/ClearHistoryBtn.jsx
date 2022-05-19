import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import historyController from '../../../controllers/historyController';

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

  const isDark = useSelector(state => state.ui.isDark);

  const handleClick = () => {
    api.send('confirm-clear-history');
  };
  return (
    <button
      className={`ml-0 mt-3 mb-3 button is-small is-primary ${isDark ? '' : 'is-outlined'} button-padding-verticals`}
      onClick={handleClick}
    >
      Clear History
    </button>
  );
};

export default ClearHistoryBtn;
