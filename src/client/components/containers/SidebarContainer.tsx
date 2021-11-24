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

const SidebarContainer = (props) => {
  // const { isDark } = props;

  const dispatch = useDispatch();
  const activeTab = useSelector((store) => store.ui.sidebarActiveTab);
  const isDark = useSelector((store) => store.ui.isDark);

  const setActiveTab = (tabName: string) =>
    dispatch(actions.setSidebarActiveTab(tabName));
    
  const handleDarkMode = (e) => {
    dispatch(actions.toggleDarkMode(e.target.checked));
  };


  return (
    <div
      className={`column is-one-third is-flex is-flex-direction-column is-tall ${isDark ? 'is-dark-400' : ''}`}
      id="composer"
    >

      {/* HEADER */}
      <div className="hero is-flex-direction-row is-primary has-text-centered header-bar">
        {/* dark mode toggle goes here : https://www.w3schools.com/howto/howto_css_switch.asp */}
        <input
            id="darkModeSwitch"
            type="checkbox" 
            className="switch mb-2 is-outlined is-warning"
            onChange={(e) => {
              handleDarkMode(e);
            }}
            checked={isDark}
        />
          <label htmlFor="darkModeSwitch"/>
        <h3 className='has-text-justified align-self-center'>Composer</h3>
        <a>v1.0 </a>
      </div>
      <div className="tabs mb-0  header-bar">
        <ul className={`columns is-gapless ${isDark ? 'is-dark-400' : ''}`}>
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
