import React from 'react';
import historyController from '../../controllers/historyController';
const { dialog } = require('electron').remote;

const ClearHistoryBtn = (props) => (
  <button onClick={() => {
    const opts = {
      type: 'warning', 
      buttons: ['Okay', 'Cancel'],
      message: 'Are you sure you want to clear history?'
    }

    dialog.showMessageBox(null, opts)
    .then((response) => {
      if (response.response === 0) {
        props.clearHistory();
      }
    })
  }}>Clear History</button>
)

export default ClearHistoryBtn;