import React, { Component, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import EventsContainer from './EventsContainer'
import HeadersContainer from './HeadersContainer'
import CookiesContainer from './CookiesContainer'
import WebSocketWindow from "../display/WebSocketWindow";

export const ResponsePaneContainer = () => {
  const [activeTab, setActiveTab] = useState('events');
  const currentResponse = useSelector(store => store.business.currentResponse); 
  console.log('currentResponse --> ', currentResponse);
  // currentResponse.request.network


  return (
      <div className='column is-one-third'>
        {/* HEADER */}
        <div className="hero is-primary has-text-centered header-bar">
          <h3>Responses</h3>
        </div>
        {/* IF WEBSOCKETS */}
        {currentResponse.request.network === 'ws' && 
          <WebSocketWindow
            key={0}
            outgoingMessages={currentResponse.request.messages}
            incomingMessages={currentResponse.response.messages}
            content={content}
            connection={connection}
          />
        }
        
        {/* IF NOT WEBSOCKETS */}
        {currentResponse.request.network !== 'ws' && 
        <div>
          {/* TAB SELECTOR */}
          <div className="tabs">
            <ul className="is-flex is-justify-content-space-evenly">
              <li className={activeTab === 'events' ? 'is-active' : ''}>
              <a 
                onClick={() => setActiveTab('events')}
              > {'Events'}
              </a>
            </li>
              <li className={activeTab === 'headers' ? 'is-active' : ''}>
                <a 
                  onClick={() => setActiveTab('headers')}
                > 
                {currentResponse.gRPC === true ? 'Metadata' : 'Headers'}
                </a>
              </li>
              <li className={activeTab === 'cookies' ? 'is-active' : ''}>
                <a 
                  onClick={() => setActiveTab('cookies')}
                > Cookies
                </a>
              </li>
            </ul>
          </div>
          {/* RESPONSES CONTENT */}
        { activeTab === 'events' && <EventsContainer currentResponse={currentResponse} key='EC1'/>}
        { activeTab === 'headers' && <HeadersContainer currentResponse={currentResponse}/>}
        { activeTab === 'cookies' && <CookiesContainer currentResponse={currentResponse}/>}
      </div>
        }
    </div>

  )

}

export default ResponsePaneContainer
