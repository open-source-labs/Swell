import React, { Component } from 'react';
import '../../../assets/style/App.scss';
import { ipcRenderer } from 'electron'; //Communicate asynchronously from a renderer process to the main process.
import ContentsContainer from './ContentsContainer.jsx';
import ReqResCtrl from '../../controllers/reqResController';
import SidebarContainer from './SidebarContainer.jsx';
import UpdatePopUpContainer from './UpdatePopUpContainer.jsx';
import historyController from '../../controllers/historyController'
import collectionsController from '../../controllers/collectionsController'


class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {// This file will listen on all of these channels(selectAll, deselectAll, etc) for any communication from the main.js file(aka the main process)
    ipcRenderer.on('selectAll', ReqResCtrl.selectAllReqRes); // if the selectAll touchbar button was clicked (then run this method called selectAllReqRes) that is located in the connectionController...likewise for the rest
    ipcRenderer.on('deselectAll', ReqResCtrl.deselectAllReqRes);
    ipcRenderer.on('openAllSelected', ReqResCtrl.openAllSelectedReqRes);
    ipcRenderer.on('closeAllSelected', ReqResCtrl.closeAllReqRes);
    ipcRenderer.on('minimizeAll', ReqResCtrl.minimizeAllReqRes);
    ipcRenderer.on('expandAll', ReqResCtrl.expandAllReqRes);
    ipcRenderer.on('clearAll', ReqResCtrl.clearAllReqRes);
    ipcRenderer.on('message', (e, text) => {
      // console.log('Message from updater: ', text)
    });
    historyController.getHistory();
    collectionsController.getCollections();
    
  }

  render() {
    return (
      <div id="app">
        {/* <UpdatePopUpContainer/> */}
        <SidebarContainer />
        <ContentsContainer />
      </div>
    );
  }
}

export default App;