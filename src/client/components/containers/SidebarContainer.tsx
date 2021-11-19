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
import sun from '../../../assets/icons/sun.svg';
import moon from '../../../assets/icons/night-mode.svg';
import ComposerContainer from '../composer/ComposerContainer';
import HistoryContainer from './HistoryContainer';

// const sun = <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" x="0" y="0" version="1.1" viewBox="0 0 29 29" xml:space="preserve"><path d="M19.282 17.038c-4.15-.513-7.691-3.379-9.245-7.261a11.042 11.042 0 0 1-.748-5.355.5.5 0 0 0-.772-.468C5.09 6.156 2.905 10.121 3.261 14.573c.442 5.524 4.959 10.056 10.482 10.513 5.646.468 10.522-3.148 12.01-8.213.118-.402-.274-.774-.661-.614a11.43 11.43 0 0 1-5.81.779z"/></svg>

const SidebarContainer = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector((store) => store.ui.sidebarActiveTab);

  const setActiveTab = (tabName: string) =>
    dispatch(actions.setSidebarActiveTab(tabName));
    
  const handleDarkMode = (e) => {
    dispatch(actions.toggleDarkMode(e));
  };


  return (
    <div
      className="column is-one-third is-flex is-flex-direction-column is-tall "
      id="composer"
    >

      {/* HEADER */}
      <div className="hero is-flex is-flex-direction-row is-primary has-text-centered header-bar">
        {/* dark mode toggle goes here : https://www.w3schools.com/howto/howto_css_switch.asp */}
        <span className="composer-section-title mr-3">Toggle Dark Mode</span>

        <input
            id="darkmodeSwitch"
            type="image"
            src={sun}
             
            className="switch"
            
            onChange={(e) => {
              handleDarkMode(e);
            }}
            checked={true}
        />
        <input
            id="darkmodeSwitch"
            type="image"
            src={moon}
             
            className="switch"
            onChange={(e) => {
              handleDarkMode(e);
            }}
            checked={true}
        />
        {/* <button src={sun}></button>  */}
        {/* <img
              src={sun}
              alt="dropdownArrow"
              className="is-awesome-icon"
              aria-hidden="true"
              onChange={(e) => {
                handleDarkMode(e)
              }}
            /> */}
          <label htmlFor="darkmodeSwitch"/>
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
