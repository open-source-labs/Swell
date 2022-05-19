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
import WorkspaceContainer from './workspace/WorkspaceContainer';


const { api } = window as unknown as WindowExt;

const App = () => {
  // Used to toggle the "update" pop-up.
  const [message, setMessage] = useState(null);
  // currentWorkspace is the current Workspace's UUID. It is only altered in WorkspaceSelect.tsx, which is rendered by CurrentWorskpaceDisplay.tsx
  const [currentWorkspaceId, setWorkspace] = React.useState('');
  // Upon opening the application, populate your history and collections.
  useEffect(() => {
    api.send('check-for-update');
    historyController.getHistory();
    collectionsController.getCollections();
  }, []);
  /**
   * All of the main components are rendered from here. Excluding the update pop up, there are only 3
   * main containers for this application.
   */
  return (
    <div id="app" className="is-tall">
      <HashRouter>
        {/* Navigation bar. Top of the application. */}
        <NavBarContainer />
        <Divider orientation="horizontal" sx={{ borderBottomWidth: 2, background: '#51819b' }}/>
        <Box sx={{ height: '100%', display: 'flex' }}>
          {/* Workspace. Left side of the application. */}
          <HistoryOrWorkspaceContainer currentWorkspaceId={currentWorkspaceId} setWorkspace={setWorkspace} />
          <Divider orientation="vertical" sx={{ borderRightWidth: 2, background: '#51819b' }} />
          {/* Main container. Contains the composer and response panes. */}
          <MainContainer currentWorkspaceId={currentWorkspaceId} />
        </Box>
        <UpdatePopUpContainer message={message} setMessage={setMessage} />
      </HashRouter>
    </div>
  );
};

export default App;
