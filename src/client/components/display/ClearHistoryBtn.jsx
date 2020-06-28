import React from "react";
import historyController from "../../controllers/historyController";

const { dialog } = require("electron").remote;

const ClearHistoryBtn = (props) => {
  const handleClick = () => {
    const opts = {
      type: "warning",
      buttons: ["Okay", "Cancel"],
      message: "Are you sure you want to clear history?",
    };

    dialog.showMessageBox(null, opts).then((response) => {
      if (response.response === 0) {
        historyController.clearHistoryFromIndexedDb();
        props.clearHistory();
      }
    });
  };
  return <button onClick={handleClick}>Clear History</button>;
};

export default ClearHistoryBtn;
