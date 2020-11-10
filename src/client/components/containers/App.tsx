import React, { useState, useEffect } from "react";
import { HashRouter } from "react-router-dom";
import "../../../assets/style/App.scss";
import { ContentsContainer } from "./ContentsContainer";
import { SidebarContainer } from "./SidebarContainer";
import historyController from "../../controllers/historyController";
import collectionsController from "../../controllers/collectionsController";
import UpdatePopUpContainer from "./UpdatePopUpContainer";
import ResponsePaneContainer from "./ResponsePaneContainer";

declare global {
  interface Window {
    api: any;
  }
}

let api = window.api;
export const App = () => {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    api.send("check-for-update");
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
  
  api.receive("fromMain", (data: {}) => console.log(data));
  
  return (
    <div className='is-gapless is-tall'>
      {/* <div id='app' className='columns is-gapless'> */}
      <div id='app' className={`columns is-gapless ${!message &&'is-tall'} ${message &&'is-tall-message'}`}>
        <HashRouter>
          <SidebarContainer/>
          <ContentsContainer/>
          <ResponsePaneContainer/>
        </HashRouter> 
      </div>
      <UpdatePopUpContainer message={message} setMessage={setMessage}/>
    </div>
  );
}