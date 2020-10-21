import React, { useState } from "react";
import { Route, Switch, Link } from 'react-router-dom';

import ComposerContainer from "../composer/ComposerContainer.jsx";
import HistoryContainer from "./HistoryContainer.jsx";
import CollectionsContainer from "./CollectionsContainer.jsx";

export const SidebarContainer = () => {
  const [activeTab, setActiveTab] = useState('composer');

  return (
    <div className='column is-one-third'>
      {/* HEADER */}
      <div className="hero is-primary">
        <h3>Composer</h3>
      </div>
      {/* TAB SELECTOR */}
      <div className="tabs">
        <ul>
          <li className={activeTab === 'composer' ? 'is-active' : ''}>
            <Link 
              to="/composer"
              onClick={() => setActiveTab('composer')}
            >Composer</Link>
          </li>
          <li className={activeTab === 'history' ? 'is-active' : ''}>
            <Link 
              to="/history"
              onClick={() => setActiveTab('history')}
            >History
            </Link>
          </li>
        </ul>
      </div>
      {/* SIDEBAR CONTENT */}
      <div>
        <Switch>
          <Route path="/composer"> <ComposerContainer /> </Route>
          <Route path="/history"> <HistoryContainer /> </Route>
          <Route path="/"> <ComposerContainer /> </Route>
        </Switch>
      </div>
    </div>
  );
}
