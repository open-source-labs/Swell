import React, { Component } from "react";
import ContentsContainer from "./ContentsContainer.jsx";
import ReqResCtrl from "../../controllers/reqResController";
import "../../../assets/style/App.scss";
import SidebarContainer from "./SidebarContainer.jsx";
import UpdatePopUpContainer from "./UpdatePopUpContainer.jsx";
import historyController from "../../controllers/historyController";
import collectionsController from "../../controllers/collectionsController";

const { api } = window;
// import ReqResCtrl from '../../controllers/reqResController';
// const EventEmitter = require('events');
// const {dialog} = require('electron').remote

class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // This file will listen on all of these channels(selectAll, deselectAll, etc) for any communication from the main.js file(aka the main process)
    // ipcRenderer.send('check-for-update');
    // api.send('check-for-update')
    // ipcRenderer.on('selectAll', ReqResCtrl.selectAllReqRes); // if the selectAll touchbar button was clicked (then run this method called selectAllReqRes) that is located in the connectionController...likewise for the rest
    // ipcRenderer.on('deselectAll', ReqResCtrl.deselectAllReqRes);
    // ipcRenderer.on('openAllSelected', ReqResCtrl.openAllSelectedReqRes);
    // ipcRenderer.on('closeAllSelected', ReqResCtrl.closeAllReqRes);
    // ipcRenderer.on('minimizeAll', ReqResCtrl.minimizeAllReqRes);
    // ipcRenderer.on('expandAll', ReqResCtrl.expandAllReqRes);
    // ipcRenderer.on('clearAll', ReqResCtrl.clearAllReqRes);

    // window on error fires for any error in program, opens a dialog allowing
    // user to continue or refresh.
    // refresh sends to ipcMain
    let errorCount = 0;
    // window.onerror = (error, url, line) => {
    //   // implement an error counter and a check for odd numbered errors due to
    //   // behavior of react cross origin error in electron. This attempts to ignore
    //   // the second error message from react that accompanies each error. Prevents
    //   // consecutive error box popups. Also ignores HTTP Protocol errors from the
    //   // auto switch from HTTP2 to HTTP1
    //   errorCount++
    //   if (errorCount % 2 !== 0 && error !== 'Uncaught Error: Protocol error' ) {
    //     let answer = dialog.showMessageBoxSync({title: `Application Error (${errorCount})`,message: `(${errorCount}) An error has occurred, you can click Continue to keep working or click Refresh Page to refresh`, buttons: ['Refresh Page', 'Continue']})
    //     if (answer === 0) {
    //       ipcRenderer.send('fatalError')
    //     }
    //   }
    // }

    historyController.getHistory();
    collectionsController.getCollections();
  }

  render() {
    api.receive("fromMain", (data) => console.log(data));
    api.send("toMain", "MEAT WITH SAUCE");
    return (
      <div id="app">
        <UpdatePopUpContainer />
        <SidebarContainer />
        <ContentsContainer />
      </div>
    );
  }
}

export default App;
