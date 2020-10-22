import React, { useState } from "react";
import { Route, Switch, Link } from 'react-router-dom';

import BarGraph from "../display/BarGraph"
import ReqResContainer from "./ReqResContainer.jsx";
import NavBarContainer from "./NavBarContainer.jsx";
import CollectionsContainer from "./CollectionsContainer";

export const ContentsContainer = () => {
  const [activeTab, setActiveTab] = useState('workspace');

  return (
    <div className="column is-one-third">
      {/* HEADER */}
      <div className="hero is-primary">
        <h3>Workspace</h3>
      </div>

      {/* TAB SELECTOR */}
      <div className="tabs">
        <ul>
          <li className={activeTab === 'workspace' ? 'is-active' : ''}>
            <Link 
              to="/workspace"
              onClick={() => setActiveTab('workspace')}
            >Requests
            </Link>
          </li>
          <li className={activeTab === 'saved-workspace' ? 'is-active' : ''}>
            <Link 
              to="/saved-workspace"
              onClick={() => setActiveTab('saved-workspace')}
            >Saved Workspace
            </Link>
          </li>
        </ul>
      </div>
      {/* WORKSPACE CONTENT */}
      <div>
        <Switch>
          <Route path="/workspace"> <NavBarContainer /> <ReqResContainer /> </Route>
          <Route path="/saved-workspace"> <CollectionsContainer /> </Route>
          <Route path="/"> <NavBarContainer /> <ReqResContainer /> </Route>
        </Switch>
      </div>
      {/* BARGRAPH CONTENT */}
      {/* NEEDS TO BE MADE COLLAPSABLE */}
      <BarGraph />
    </div>
  );
}
