import React, { Component, useState } from 'react'

export const ResponsePaneContainer = () => {
  const [activeTab, setActiveTab] = useState('workspace');

  return (
      <div className='column is-one-third'>
        {/* HEADER */}
        <div className="hero is-primary">
          <h3>Responses</h3>
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

      </div>
  )

}

export default ResponsePaneContainer
