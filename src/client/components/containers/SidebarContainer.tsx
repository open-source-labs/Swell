/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../../actions/actions';
import ComposerContainer from '../composer/ComposerContainer';
import HistoryContainer from './HistoryContainer';

const SidebarContainer = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector((store) => store.ui.sidebarActiveTab);

  const setActiveTab = (tabName: string) =>
    dispatch(actions.setSidebarActiveTab(tabName));

  return (
    <div
      className="column is-one-third is-flex is-flex-direction-column is-tall "
      id="composer"
    >
      {/* HEADER */}
      <div className="hero is-primary has-text-centered header-bar">
        <h3>Composer</h3>
      </div>
      {/* TAB SELECTOR */}
      <div className="tabs mb-0  header-bar">
        <ul className="columns is-gapless ">
          <li
            className={`column ${activeTab === 'composer' ? 'is-active' : ''}`}
          >
            <a onClick={() => setActiveTab('composer')}>Composer</a>
          </li>
          <li
            className={`column ${activeTab === 'history' ? 'is-active' : ''}`}
          >
            <a onClick={() => setActiveTab('history')}>History</a>
          </li>
        </ul>
      </div>
      {/* SIDEBAR CONTENT */}
      {activeTab === 'composer' && <ComposerContainer />}
      {activeTab === 'history' && <HistoryContainer />}
    </div>
  );
};

export default SidebarContainer;
