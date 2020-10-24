import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom';

export default function NetworkDropdown({ onProtocolSelect, network }) {
  const [dropdownIsActive, setDropdownIsActive] = useState();
  const dropdownEl = useRef();

  useEffect(() => {
    const closeDropdown = (event) => {
      if (!dropdownEl.current.contains(event.target)) {
        setDropdownIsActive(false);
      }
    }
    document.addEventListener('click', closeDropdown);
    return () => document.removeEventListener('click', closeDropdown);
  }, []);

  return (
    <div ref={dropdownEl} className={`dropdown full-width is-fullwidth ${dropdownIsActive ? 'is-active' : ''}`}>
        
      <div className="dropdown-trigger full-width is-fullwidth">
        <button className="button is-fullwidth" aria-haspopup="true" aria-controls="dropdown-menu"
          onClick={() => setDropdownIsActive(!dropdownIsActive)}
        >
          <span>{network.toUpperCase()}</span>
          <span className="icon is-small">
            <i className="fas fa-caret-down" aria-hidden="true" />
          </span>
        </button>
      </div>

      <div className="dropdown-menu">
        <div className="dropdown-content">
          <Link to="/compose-rest" 
            onClick={() => {
              setDropdownIsActive(false);
              onProtocolSelect("rest"); 
            }} 
            className="dropdown-item" 
          >REST</Link>
          <Link to="/compose-graphql" 
            onClick={() => {
              setDropdownIsActive(false);
              onProtocolSelect("graphql"); 
            }} 
            className="dropdown-item" 
          >GRAPHQL</Link>
          <Link to="/compose-grpc" 
            onClick={() => {
              setDropdownIsActive(false);
              onProtocolSelect("grpc");
            }} 
            className="dropdown-item" 
          >GRPC</Link>
          <Link to="/compose-ws" 
            onClick={() => {
              setDropdownIsActive(false);
              onProtocolSelect("ws"); 
            }} 
            className="dropdown-item" 
          >WEB SOCKETS</Link>
        </div>
      </div>

    </div>
  )
}