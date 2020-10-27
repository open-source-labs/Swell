import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

const classNames = require("classnames");

const GRPCServiceOrRequestSelect = (props) => {
  const {
    value,
    items,
    onClick,
    defaultTitle,
  } = props;

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


  const listItems = [];
  items.forEach((itemStr, index) => {
    if (value !== itemStr){
      listItems.push(
        <li 
          onClick={(e) => {
            setDropdownIsActive(false); 
            onClick(e);
          }}
          key={`listItem${index}`}
          className="dropdown-item" 
        >{itemStr}</li>
      );
    }
  });
  
  return (
    <div ref={dropdownEl} className={`body-type-select dropdown ${dropdownIsActive ? 'is-active' : ''}`}>

      <div className="dropdown-trigger">
        <button className="button is-small is-outlined is-primary mr-3 add-header-or-cookie-button" aria-haspopup="true" aria-controls="dropdown-menu"
          onClick={() => setDropdownIsActive(!dropdownIsActive)}
        >
          <span>{value}</span>
          <span className="icon is-small">
            <i className="fas fa-caret-down" aria-hidden="true" />
          </span>
        </button>
      </div>
      <div className="dropdown-menu">
        { !!listItems.length &&
          <ul className="dropdown-content">
            {listItems} 
          </ul>
        }
      </div>
    </div>
  );
}

export default GRPCServiceOrRequestSelect;
