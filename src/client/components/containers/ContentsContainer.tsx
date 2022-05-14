import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as uiactions from './../../features/ui/uiSlice';
import BarGraph from '../display/BarGraph';
import WorkspaceContainer from './WorkspaceContainer';
import ScheduleContainer from './ScheduleContainer';
import CollectionsContainer from './CollectionsContainer';

const ContentsContainer = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector((store) => store.ui.workspaceActiveTab);
  const currentResponse = useSelector(
    (store) => store.business.currentResponse
  );
  const isDark = useSelector((store) => store.ui.isDark);
  
  const setActiveTab = (tabName: string) =>
    dispatch(uiactions.setWorkspaceActiveTab(tabName));

  const [showGraph, setShowGraph] = useState(false);

  return (
    <div
    // className={`${isDark ? 'is-dark-400 dark-divider' : 'is-divider-neutral-300'} column is-tall is-one-third is-flex is-flex-direction-column`}  // gigi playing with css
      className={`${isDark ? 'is-dark-400 dark-divider' : 'is-divider-neutral-300'} box is-3 is-tall add-vertical-scroll`}
      id="workspace"
      style={{margin: "10px", maxHeight: "98vh"}}
    >
      {/* HEADER */}
      <div className="hero is-primary has-text-centered">
        <h3>Workspace</h3>
      </div>

      {/* TAB SELECTOR */}
      <div className="tabs header-bar">
        <ul className={`columns is-gapless ${isDark ? 'dark-divider' : ''}`}>
          <li
            className={`column ${activeTab === 'workspace' ? 'is-active' : ''}`}
          >
            <a onClick={() => setActiveTab('workspace')}>Requests</a>
          </li>
          <li
            className={`column ${
              activeTab === 'saved-workspace' ? 'is-active' : ''
            }`}
          >
            <a onClick={() => setActiveTab('saved-workspace')}>
              Saved Workspace
            </a>
          </li>
          <li
            className={`column ${activeTab === 'schedule' ? 'is-active' : ''}`}
          >
            <a onClick={() => setActiveTab('schedule')}>Schedule</a>
          </li>
        </ul>
      </div>

      {/* WORKSPACE CONTENT */}
      <div className="is-flex-grow-3 add-vertical-scroll">
        {activeTab === 'workspace' && <WorkspaceContainer />}

        {activeTab === 'saved-workspace' && <CollectionsContainer />}

        {activeTab === 'schedule' && <ScheduleContainer />}
      </div>

      {/* BARGRAPH CONTENT */}
      {currentResponse.id && (
        <div
          className={`is-flex is-align-items-center is-justify-content-center is-graph-footer is-clickable`}
          onClick={() => setShowGraph(showGraph === false)}
        >
          {showGraph && 'Hide Response History'}
          {!showGraph && 'View Response History'}
        </div>
      )}
      {showGraph && (
        <div>
          <BarGraph />
        </div>
      )}
    </div>
  );
};

export default ContentsContainer;
