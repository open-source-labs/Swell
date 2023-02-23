// Base React and React Router scaffolding
import React, { useState, useEffect, useReducer } from 'react';
import { HashRouter } from 'react-router-dom';

// Controllers
import historyController from '../controllers/historyController';
import collectionsController from '../controllers/collectionsController';

// Local components
import UpdatePopUpContainer from './legacy-components/UpdatePopUpContainer';
import HistoryOrWorkspaceContainer from './workspace/HistoryOrWorkspaceContainer';
import NavBarContainer from './navbar/NavBarContainer';
import MainContainer from './main/MainContainer';
import { WindowExt } from '../../types';

// Material UI components
import { Box, Divider } from '@mui/material';
import Split from "react-split";
// Error handling
import ErrorBoundary from './utilities/ErrorBoundary/ErrorBoundary';

// Import styling
/**
 * @todo
 * Note to future devs:
 * Our team was not able to complete migrating all of the existing components
 * to use Material UI. This should be finished for a couple of reasons:
 *
 * (1) This application needs consistent styling, and making changes to the
 * SASS files can really complicate development of the app.
 *
 * (2) Material UI is very easy to use and very supported. If you know React and
 * a touch of CSS, you'll be able to quickly make visually-compatible components
 * without touching CSS files, which will speed up development.
 *
 * - AA 18 May, 2022
 */
import '../../assets/style/App.scss';
import WorkspaceContainer from './workspace/WorkspaceContainer';

const { api } = window as unknown as WindowExt;

const App = () => {
  // currentWorkspace is the current Workspace's UUID. It is only altered in
  // WorkspaceSelect.tsx, which is rendered by CurrentWorskpaceDisplay.tsx
  const [currentWorkspaceId, setWorkspace] = useState('');

  // Upon opening the application, populate your history and collections.
  useEffect(() => {
    api.send('check-for-update');
    historyController.getHistory();
    collectionsController.getCollections();
  }, []);

  /**
   * All of the main components are rendered from here. Excluding the update pop
   * up, there are only 3 main containers for this application.
   */
  return (
    <div id="app" className="is-tall">
      <HashRouter>
        <ErrorBoundary>
          <NavBarContainer />
        </ErrorBoundary>

        {/* <Box sx={{ height: '100%', display: 'flex' }}> */}
          {/* Workspace. Left side of the application. */}
          <Split direction="horizontal" gutterSize={5} style={{ width: '100%', height: '100%', display: 'flex'}}>
              <ErrorBoundary>
                <HistoryOrWorkspaceContainer
                  currentWorkspaceId={currentWorkspaceId}
                  setWorkspace={setWorkspace}
                />
              </ErrorBoundary>
            {/* <Divider
              orientation="vertical"
              sx={{ borderRightWidth: 2, background: '#51819b' }}
            /> */}

            {/* Main container. Contains the composer and response panes. */}
            <ErrorBoundary>
              <MainContainer currentWorkspaceId={currentWorkspaceId} />
            </ErrorBoundary>
          </Split>
        {/* </Box> */}

        <ErrorBoundary>
          <UpdatePopUpContainer />
        </ErrorBoundary>
      </HashRouter>
    </div>
  );
};

export default App;
