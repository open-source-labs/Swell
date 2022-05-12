import React, { useState, useEffect, JSXElementConstructor } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import ContentsContainer from '../components/containers/ContentsContainer';
import SidebarContainer from '../components/containers/SidebarContainer';
import ResponsePaneContainer from '../components/containers/ResponsePaneContainer';
import RightSideContainer from '../components/containers/RightSideContainer';
import historyController from '../controllers/historyController';
import collectionsController from '../controllers/collectionsController';
import UpdatePopUpContainer from '../components/containers/UpdatePopUpContainer';
import { WindowExt } from '../../types'
import '../../assets/style/App.scss';
import NavBarContainer from './navbar/NavBarContainer';
import WorkspaceContainer from './workspace/WorkspaceContainer';

import Box from '@mui/material/Box';


const { api } = window as unknown as WindowExt;

const App = () => {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    api.send('check-for-update');
    historyController.getHistory();
    collectionsController.getCollections();
  }, []);

  return (
    <div id="app" className="is-tall">
      <HashRouter>
        <NavBarContainer /> 
        <Box sx={{ height: '100%', display: 'flex' }}> 
          <WorkspaceContainer />
          <ContentsContainer />
          <div className="tile is-vertical add-vertical-scroll">
            <SidebarContainer />
            <ResponsePaneContainer />
        </div>
        </Box>
        <Routes>
          <Route
            path="/"
            element={<p></p>}
          />
          <Route
            path="/graphql"
            element={<p></p>}
          />
          <Route
            path="/grpc"
            element={<p></p>}
          />
          <Route
            path="/websocket"
            element={<p></p>}
          />
          <Route
            path="/webrtc"
            element={<p></p>}
          />
          <Route
            path="/openapi"
            element={<p></p>}
          />
          <Route
            path="/webhook"
            element={<p></p>}
          />
        </Routes>
        <UpdatePopUpContainer message={message} setMessage={setMessage} />
      </HashRouter>
    </div>
  );
};

export default App;
