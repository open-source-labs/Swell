/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useState, useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import ContentsContainer from './ContentsContainer';
import SidebarContainer from './SidebarContainer';
import historyController from '../../controllers/historyController';
import collectionsController from '../../controllers/collectionsController';
import UpdatePopUpContainer from './UpdatePopUpContainer';
import ResponsePaneContainer from './ResponsePaneContainer';
import '../../../assets/style/App.scss';

declare global {
  interface Window {
    api: any;
  }
}

const { api } = window;

const App = () => {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    api.send('check-for-update');
    // This file will listen on all of these channels(selectAll, deselectAll, etc) for any communication from the main.js file(aka the main process)
    // current disabled as none of us have a touch bar. If activated, follow the api.send method.

    // ipcRenderer.on('selectAll', ReqResCtrl.selectAllReqRes); // if the selectAll touchbar button was clicked (then run this method called selectAllReqRes) that is located in the connectionController...likewise for the rest
    // ipcRenderer.on('deselectAll', ReqResCtrl.deselectAllReqRes);
    // ipcRenderer.on('openAllSelected', ReqResCtrl.openAllSelectedReqRes);
    // ipcRenderer.on('closeAllSelected', ReqResCtrl.closeAllReqRes);
    // ipcRenderer.on('minimizeAll', ReqResCtrl.minimizeAllReqRes);
    // ipcRenderer.on('expandAll', ReqResCtrl.expandAllReqRes);
    // ipcRenderer.on('clearAll', ReqResCtrl.clearAllReqRes);

    historyController.getHistory();
    collectionsController.getCollections();
  });

  return (
    <div className="is-gapless is-tall">
      <div
        id="app"
        className={`columns is-gapless ${!message && 'is-tall'} ${
          message && 'is-tall-message'
        }`}
      >
        <HashRouter>
          <SidebarContainer />
          <ContentsContainer />
          <ResponsePaneContainer />
        </HashRouter>
      </div>
      <UpdatePopUpContainer message={message} setMessage={setMessage} />
    </div>
  );
};

export default App;
