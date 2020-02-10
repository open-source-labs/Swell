import React, { Component } from 'react';
import '../../../assets/style/App.scss';
import { ipcRenderer } from 'electron'; //Communicate asynchronously from a renderer process to the main process.
import ContentsContainer from './ContentsContainer.jsx';
import ReqResCtrl from '../../controllers/reqResController';
import SidebarContainer from './SidebarContainer.jsx';
import UpdatePopUpContainer from './UpdatePopUpContainer.jsx';
import historyController from '../../controllers/historyController';
import collectionsController from '../../controllers/collectionsController';
const EventEmitter = require('events');

class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {// This file will listen on all of these channels(selectAll, deselectAll, etc) for any communication from the main.js file(aka the main process)
    ipcRenderer.send('check-for-update');
    ipcRenderer.on('selectAll', ReqResCtrl.selectAllReqRes); // if the selectAll touchbar button was clicked (then run this method called selectAllReqRes) that is located in the connectionController...likewise for the rest
    ipcRenderer.on('deselectAll', ReqResCtrl.deselectAllReqRes);
    ipcRenderer.on('openAllSelected', ReqResCtrl.openAllSelectedReqRes);
    ipcRenderer.on('closeAllSelected', ReqResCtrl.closeAllReqRes);
    ipcRenderer.on('minimizeAll', ReqResCtrl.minimizeAllReqRes);
    ipcRenderer.on('expandAll', ReqResCtrl.expandAllReqRes);
    ipcRenderer.on('clearAll', ReqResCtrl.clearAllReqRes);
    
    // window.onerror = (error, url, line) => {
    //   console.log('had an err, send to ipcMain')
    //   alert('Fatal Error, Press OK to Refresh')
    //   ipcRenderer.send('fatalError')
    // }
    // process.on('uncaughtException', (err) => {
    //   console.log('whoops! there was an error');
    // });

    historyController.getHistory();
    collectionsController.getCollections();

  }

  render() {
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