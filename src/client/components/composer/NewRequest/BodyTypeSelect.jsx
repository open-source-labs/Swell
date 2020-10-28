import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

const classNames = require("classnames");

const BodyTypeSelect = (props) => {
  const {
    setNewRequestBody,
    newRequestBody,
    setNewRequestHeaders,
    newRequestHeaders,
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

  const removeContentTypeHeader = () => {
    const filtered = newRequestHeaders.headersArr.filter(
      (header) => header.key.toLowerCase() !== "content-type"
    );
    setNewRequestHeaders({
      headersArr: filtered,
      count: filtered.length,
    });
  }

  const setNewBodyType = (bodyTypeStr) => {
    setNewRequestBody({
      ...newRequestBody,
      bodyType: bodyTypeStr,
    })
  }

  return (
    <div ref={dropdownEl} className={`body-type-select dropdown ${dropdownIsActive ? 'is-active' : ''}`}>

      <div className="dropdown-trigger">
        <button className="button is-small is-outlined is-primary mr-3 add-header-or-cookie-button" aria-haspopup="true" aria-controls="dropdown-menu"
          onClick={() => setDropdownIsActive(!dropdownIsActive)}
        >
          <span>{newRequestBody.bodyType}</span>
          <span className="icon is-small">
            <i className="fas fa-caret-down" aria-hidden="true" />
          </span>
        </button>
      </div>

      <div className="dropdown-menu">
        <ul className="dropdown-content">
          {newRequestBody.bodyType !== 'raw' &&
            <a 
              onClick={() => {
                setDropdownIsActive(false); 
                setNewBodyType("raw")
              }} 
              className="dropdown-item" 
            >raw</a>
          }
          {newRequestBody.bodyType !== 'x-www-form-urlencoded' &&
            <a
              onClick={() => {
                setDropdownIsActive(false);
                setNewBodyType('x-www-form-urlencoded'); 
              }} 
              className="dropdown-item" 
            >x-www-form-urlencoded</a>
          }
          {newRequestBody.bodyType !== 'none' &&
            <a
              onClick={() => {
                setDropdownIsActive(false);
                setNewBodyType('none')
                removeContentTypeHeader();
              }} 
              className="dropdown-item" 
            >none</a>
          }
        </ul>
      </div>
    </div>
    );
  }


BodyTypeSelect.propTypes = {
  newRequestBody: PropTypes.object.isRequired,
  setNewRequestBody: PropTypes.func.isRequired,
};

export default BodyTypeSelect;
