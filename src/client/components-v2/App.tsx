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
import MainContainer from './main/MainContainer';


import { Box, Divider } from '@mui/material';


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
          {/* New MUI workspace. */}
          <WorkspaceContainer />
          {/* Legacy workspace. */}
          <ContentsContainer />

          <Divider orientation="vertical"/>

          {/* New MUI main container. */}
          <MainContainer />
          {/* Legacy main container */}
          <div className="tile is-vertical add-vertical-scroll">
            <SidebarContainer />
            <ResponsePaneContainer />
          </div>
        </Box>
        <UpdatePopUpContainer message={message} setMessage={setMessage} />
      </HashRouter>
    </div>
  );
};

export default App;
