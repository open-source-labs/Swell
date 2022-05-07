import React, { useState, useEffect, JSXElementConstructor } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import ContentsContainer from './ContentsContainer';
import SidebarContainer from './SidebarContainer';
import ResponsePaneContainer from './ResponsePaneContainer';
import RightSideContainer from './RightSideContainer';
import historyController from '../../controllers/historyController';
import collectionsController from '../../controllers/collectionsController';
import UpdatePopUpContainer from './UpdatePopUpContainer';
import { WindowExt } from '../../../types'
import '../../../assets/style/App.scss';
import NavBarContainer from './mui-components/nav-bar/NavBarContainer';
import WorkspaceContainer from './mui-components/workspace/WorkspaceContainer';

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
    <Box className='is-tall'>
      <HashRouter>
        <NavBarContainer /> 
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
        <Box
          id="app"
          className={`columns is-gapless ${!message && 'is-tall'} ${
            message && 'is-tall-message'
          }`}>
          <WorkspaceContainer />
          <ContentsContainer />
          <div className="tile is-vertical add-vertical-scroll">
            <SidebarContainer />
            <ResponsePaneContainer />
          </div>
        </Box>
        <UpdatePopUpContainer message={message} setMessage={setMessage} />
      </HashRouter>
  </Box>
  );
};

export default App;
