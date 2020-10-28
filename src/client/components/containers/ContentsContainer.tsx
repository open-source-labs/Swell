import React, { useState } from "react";

import BarGraph from "../display/BarGraph"
import NavBarContainer from "./NavBarContainer.jsx";
import CollectionsContainer from "./CollectionsContainer";

export const ContentsContainer = () => {
  const [activeTab, setActiveTab] = useState('workspace');
  const [showGraph, setShowGraph] = useState(false);

  return (
    <div className="column is-one-third is-flex is-flex-direction-column is-tall is-divider-neutral-300">
      {/* HEADER */}
      <div className="hero is-primary has-text-centered">
        <h3>Workspace</h3>
      </div>

      {/* TAB SELECTOR */}
      <div className="tabs">
        <ul className='columns is-gapless'>
          <li className={`column ${activeTab === 'workspace' ? 'is-active' : '' }`}>
            <a 
              onClick={() => setActiveTab('workspace')}
            >Requests
            </a>
          </li>
          <li className={`column ${activeTab === 'saved-workspace' ? 'is-active' : '' }`}>
            <a 
              onClick={() => setActiveTab('saved-workspace')}
            >Saved Workspace
            </a>
          </li>
        </ul>
      </div>
      {/* WORKSPACE CONTENT */}
      <div className="is-flex-grow-3 add-vertical-scroll">

        {activeTab === 'workspace' && 
          <NavBarContainer />
        }

        {activeTab === 'saved-workspace' && 
          <CollectionsContainer setWorkspaceTab={setActiveTab}/>
        }

      </div>

      {/* BARGRAPH CONTENT */}
        {showGraph &&
          <BarGraph />
        }
        <div 
          className="is-flex is-align-items-center is-justify-content-center is-graph-footer is-clickable is-border-neutral-300"
          onClick={() => setShowGraph(showGraph === false)}
          >
            {showGraph &&
              'Hide Performance Charts'
            }
            {!showGraph &&
              'View Performance Charts'
            }
        </div>
    </div>
  );
}
