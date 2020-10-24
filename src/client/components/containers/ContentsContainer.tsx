import React, { useState } from "react";

import BarGraph from "../display/BarGraph"
import NavBarContainer from "./NavBarContainer.jsx";
import CollectionsContainer from "./CollectionsContainer";

export const ContentsContainer = () => {
  const [activeTab, setActiveTab] = useState('workspace');

  return (
    <div className="column is-one-third">
      {/* HEADER */}
      <div className="hero is-primary has-text-centered">
        <h3>Workspace</h3>
      </div>

      {/* TAB SELECTOR */}
      <div className="tabs">
        <ul>
          <li className={activeTab === 'workspace' ? 'is-active' : ''}>
            <a 
              onClick={() => setActiveTab('workspace')}
            >Requests
            </a>
          </li>
          <li className={activeTab === 'saved-workspace' ? 'is-active' : ''}>
            <a 
              onClick={() => setActiveTab('saved-workspace')}
            >Saved Workspace
            </a>
          </li>
        </ul>
      </div>
      {/* WORKSPACE CONTENT */}
      <div>

        {activeTab === 'workspace' && 
          <NavBarContainer />
        }

        {activeTab === 'saved-workspace' && 
          <CollectionsContainer />
        }

      </div>
      {/* BARGRAPH CONTENT */}
      {/* NEEDS TO BE MADE COLLAPSABLE */}
      {/* <BarGraph /> */}
    </div>
  );
}
