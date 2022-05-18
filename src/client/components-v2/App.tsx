import React, { useState, useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
// Import controllers
import historyController from '../controllers/historyController';
import collectionsController from '../controllers/collectionsController';
// Import local components
import UpdatePopUpContainer from './legacy-components/UpdatePopUpContainer';
import HistoryOrWorkspaceContainer from './workspace/HistoryOrWorkspaceContainer';
import NavBarContainer from './navbar/NavBarContainer';
import MainContainer from './main/MainContainer';
import { WindowExt } from '../../types'
// Import MUI components
import { Box, Divider } from '@mui/material';
// Import styling
/**
 * Note to future devs:
 * Our team is finishing our work on this app, and part of our stretch goals were to migrate
 * all of the existing components to use Material UI. We made this decision for a few reasons:
 * (1) There are a toooon of people who work on this application. It needs consistent styling,
 * and making changes to the SASS files can really complicate development of the app.
 * (2) Material UI is very easy to use and very supported. If you know React and a touch of CSS, you'll be able
 * to quickly make visually-compatible components without touching CSS files, which will speed up
 * development.
 * - AA 18 May, 2022
 */
import '../../assets/style/App.scss';


const { api } = window as unknown as WindowExt;

const App = () => {
  {/*  */}
  const [message, setMessage] = useState(null);
  // currentWorkspace is the current Workspace's UUID. It is only altered in WorkspaceSelect.tsx, which is rendered by CurrentWorskpaceDisplay.tsx
  const [currentWorkspaceId, setWorkspace] = React.useState('');

  useEffect(() => {
    api.send('check-for-update');
    historyController.getHistory();
    collectionsController.getCollections();
  }, []);

  return (
    <div id="app" className="git brais-tall">
      <HashRouter>
        <NavBarContainer />
        <Divider orientation="horizontal"/>
        <Box sx={{ height: '100%', display: 'flex' }}>
          {/* New MUI workspace. */}
          {/* <WorkspaceContainer currentWorkspaceId={currentWorkspaceId} setWorkspace={setWorkspace} /> */}
          <HistoryOrWorkspaceContainer currentWorkspaceId={currentWorkspaceId} setWorkspace={setWorkspace} />
          {/* Legacy workspace. */}
          {/* <ContentsContainer /> */}
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
