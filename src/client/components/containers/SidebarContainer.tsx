import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../../actions/actions';
import ComposerContainer from "../composer/ComposerContainer.jsx";
import HistoryContainer from "./HistoryContainer.jsx";

export const SidebarContainer = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector(store => store.ui.sidebarActiveTab);
  const setActiveTab = (tabName) => dispatch(actions.setSidebarActiveTab(tabName));

  return (
    <div className='column is-one-third is-flex is-flex-direction-column is-tall ' id='composer'>
      {/* HEADER */}
      <div className="hero is-primary has-text-centered header-bar">
        <h3>Composer</h3>
      </div>
      {/* TAB SELECTOR */}
      <div className="tabs mb-0  header-bar">
        <ul className="columns is-gapless ">
          <li className={`column ${activeTab === 'composer' ? 'is-active' : '' }`}>
            <a 
              onClick={() => setActiveTab('composer')}
            >Composer</a>
          </li>
          <li className={`column ${activeTab === 'history' ? 'is-active' : '' }`}>
            <a 
              onClick={() => setActiveTab('history')}
            >History
            </a>
          </li>
        </ul>
      </div>
      {/* SIDEBAR CONTENT */}
      {
        activeTab === "composer" &&
        <ComposerContainer />
      }
        {activeTab === "history" &&
        <HistoryContainer/>
      }
      
    </div>
  );
}
