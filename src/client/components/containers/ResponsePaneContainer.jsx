import React, { Component, useState } from 'react'
import EventsContainer from './EventsContainer'

export const ResponsePaneContainer = () => {
  const [activeTab, setActiveTab] = useState('events');

  return (
      <div className='column is-one-third'>
        {/* HEADER */}
        <div className="hero is-primary has-text-centered">
          <h3>Responses</h3>
        </div>
        {/* TAB SELECTOR */}
        <div className="tabs">
          <ul className="is-flex is-justify-content-space-evenly">
            <li className={activeTab === 'events' ? 'is-active' : ''}>
              <a onClick={() => setActiveTab('events')} > Events
              </a>
            </li>
            <li className={activeTab === 'headers' ? 'is-active' : ''}>
              <a 
                onClick={() => setActiveTab('headers')}
              >Headers
              </a>
            </li>
            <li className={activeTab === 'cookies' ? 'is-active' : ''}>
              <a 
                onClick={() => setActiveTab('cookies')}
              >Cookies
              </a>
            </li>
          </ul>
        </div>
        {/* RESPONSES CONTENT */}
      { activeTab === 'events' && <EventsContainer />}

      </div>
  )

}

export default ResponsePaneContainer
