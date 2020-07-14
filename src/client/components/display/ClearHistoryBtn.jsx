import React from "react";
import historyController from "../../controllers/historyController";


// utilizing API we created in preload.js for node-free IPC communication
const { api } = window; 

const ClearHistoryBtn = (props) => {
  // api.receive('clear-history-response', (res) => {
  //   // a response of 0 from main means user has selected 'confirm'
  //   console.log('response from main:', res.response)
  //   if (res.response === 0) {
  //     historyController.clearHistoryFromIndexedDb();
  //     props.clearHistory();
  //   };
  // });

  const handleClick = () => {

    // api.send('confirm-clear-history'); 

  };
  return <button onClick={handleClick}>Clear History</button>;
};

export default ClearHistoryBtn;
