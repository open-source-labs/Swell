// Base React and React Router scaffolding
import React, { useState, useEffect } from 'react';
import Split from 'react-split';
import { HashRouter } from 'react-router-dom';

// Controllers
import historyController from '../controllers/historyController';
import collectionsController from '../controllers/collectionsController';

// Local components
// import UpdatePopUpContainer from './legacy-components/UpdatePopUpContainer';
import HistoryOrWorkspaceContainer from './workspace/HistoryOrWorkspaceContainer';
import NavBarContainer from './navbar/NavBarContainer';
import MainContainer from './main/MainContainer';

// Types
import { WindowExt } from '../../types';

// Error handling
import ErrorBoundary from './utilities/ErrorBoundary/ErrorBoundary';

// Import styling
import '../../assets/style/App.scss';

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

        {/* Workspace. Left side of the application. */}
        <Split
          direction="horizontal"
          sizes={[35, 65]}
          gutterSize={5}
          style={{ width: '100%', height: '100%', display: 'flex' }}
        >
          <ErrorBoundary>
            <HistoryOrWorkspaceContainer
              currentWorkspaceId={currentWorkspaceId}
              setWorkspace={setWorkspace}
            />
          </ErrorBoundary>

          {/* Main container. Contains the composer and response panes. */}
          <ErrorBoundary>
            <MainContainer currentWorkspaceId={currentWorkspaceId} />
          </ErrorBoundary>
        </Split>

        <ErrorBoundary>
          {/* <UpdatePopUpContainer /> */}
        </ErrorBoundary>
      </HashRouter>
    </div>
  );
};

export default App;
