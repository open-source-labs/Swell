/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../../actions/actions';
import BarGraph from '../display/BarGraph';
import WorkspaceContainer from './WorkspaceContainer.jsx';
import ScheduleContainer from './ScheduleContainer.jsx';
import CollectionsContainer from './CollectionsContainer';

const ContentsContainer = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector((store) => store.ui.workspaceActiveTab);
  const currentResponse = useSelector(
    (store) => store.business.currentResponse
  );
  const setActiveTab = (tabName) =>
    dispatch(actions.setWorkspaceActiveTab(tabName));

  const [showGraph, setShowGraph] = useState(false);

  return (
    <div
      className="column is-one-third is-flex is-flex-direction-column is-tall is-divider-neutral-300"
      id="workspace"
    >
      {/* HEADER */}
      <div className="hero is-primary has-text-centered header-bar">
        <h3>Workspace</h3>
      </div>

      {/* TAB SELECTOR */}
      <div className="tabs header-bar">
        <ul className="columns is-gapless">
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
          className="is-flex is-align-items-center is-justify-content-center is-graph-footer is-clickable is-border-neutral-300"
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
