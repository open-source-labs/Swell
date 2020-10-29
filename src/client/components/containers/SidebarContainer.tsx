import React, { useState } from "react";
// import { Route, Switch, Link } from 'react-router-dom';

import ComposerContainer from "../composer/ComposerContainer.jsx";
import HistoryContainer from "./HistoryContainer.jsx";
import CollectionsContainer from "./CollectionsContainer.jsx";

export const SidebarContainer = () => {
  const [activeTab, setActiveTab] = useState('composer');

  return (
    <div className='column is-one-third is-flex is-flex-direction-column is-tall '>
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
        <HistoryContainer setSidebarTab={setActiveTab}/>
      }
      
    </div>
  );
}
