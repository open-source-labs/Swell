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

  // currentWorkspace is the current Workspace's UUID. It is only altered in WorkspaceSelect.tsx, which is rendered by CurrentWorskpaceDisplay.tsx
  const [currentWorkspaceId, setWorkspace] = React.useState('');

  useEffect(() => {
    api.send('check-for-update');
    historyController.getHistory();
    collectionsController.getCollections();
  }, []);

  return (
    <div id="app" className="is-tall">
      <HashRouter>
        <NavBarContainer />
        <Divider orientation="horizontal"/>
        <Box sx={{ height: '100%', display: 'flex' }}>
          {/* New MUI workspace. */}
          <WorkspaceContainer currentWorkspaceId={currentWorkspaceId} setWorkspace={setWorkspace} />
          {/* Legacy workspace. */}
          <ContentsContainer />
          <Divider orientation="vertical"/>
          {/* New MUI main container. */}
          <MainContainer currentWorkspaceId={currentWorkspaceId} />
          {/* Legacy main container */}
          {/* <div className="tile is-vertical add-vertical-scroll">
            <SidebarContainer />
            <ResponsePaneContainer />
          </div> */}
        </Box>
        <UpdatePopUpContainer message={message} setMessage={setMessage} />
      </HashRouter>
    </div>
  );
};

export default App;
