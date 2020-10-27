import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

const classNames = require("classnames");

const RawBodyTypeSelect = (props) => {
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

  // const removeContentTypeHeader = () => {
  //   const filtered = newRequestHeaders.headersArr.filter(
  //     (header) => header.key.toLowerCase() !== "content-type"
  //   );
  //   setNewRequestHeaders({
  //     headersArr: filtered,
  //     count: filtered.length,
  //   });
  // }

  const setNewRawBodyType = (rawTypeStr) => {
    setNewRequestBody({
      ...newRequestBody,
      rawType: rawTypeStr,
    })
  }

  return (
    <div ref={dropdownEl} className={`body-type-select mr-3 dropdown ${dropdownIsActive ? 'is-active' : ''}`}>

      <div className="dropdown-trigger">
        <button className="button is-small is-primary is-outlined add-header-or-cookie-button" aria-haspopup="true" aria-controls="dropdown-menu"
          onClick={() => setDropdownIsActive(!dropdownIsActive)}
        >
          <span>{newRequestBody.rawType}</span>
          <span className="icon is-small">
            <i className="fas fa-caret-down" aria-hidden="true" />
          </span>
        </button>
      </div>

      <div className="dropdown-menu">
        <ul className="dropdown-content">
          {newRequestBody.rawType !== 'text/plain' &&  
            <li 
              onClick={() => {
                setDropdownIsActive(false); 
                setNewRawBodyType("text/plain")
              }} 
              className="dropdown-item" 
            >text/plain</li>
          }
          {newRequestBody.rawType !== 'application/json' &&
            <li  
              onClick={() => {
                setDropdownIsActive(false);
                setNewRawBodyType('application/json'); 
              }} 
              className="dropdown-item" 
            >application/json</li>
          }
          {newRequestBody.rawType !== 'application/javascript' && 
            <li 
              onClick={() => {
                setDropdownIsActive(false);
                setNewRawBodyType('application/javascript')
              }} 
              className="dropdown-item" 
            >application/javascript</li>
          }
          {newRequestBody.rawType !== 'application/xml' && 
            <li 
              onClick={() => {
                setDropdownIsActive(false);
                setNewRawBodyType('application/xml')
              }} 
              className="dropdown-item" 
            >application/xml</li>
          }
          {newRequestBody.rawType !== 'text/xml' && 
            <li 
              onClick={() => {
                setDropdownIsActive(false);
                setNewRawBodyType('text/xml')     
              }} 
              className="dropdown-item" 
            >text/xml</li>
          }
          {newRequestBody.rawType !== 'text/html' && 
            <li 
              onClick={() => {
                setDropdownIsActive(false);
                setNewRawBodyType('text/html')
              }} 
              className="dropdown-item" 
            >text/html</li>
          }
        </ul>
      </div>
    </div>
    );
  }
  
  // <select
  // onChange={(e) =>
  //   setNewRequestBody({
  //     ...newRequestBody,
  //     rawType: e.target.value,
  //   })
  // }
  // value={newRequestBody.rawType}
// >
//   {/* Raw Type: */}
//   <option value="text/plain">Text (text/plain)</option>
//   <option value="application/json">JSON (application/json)</option>
//   <option value="application/javascript">Javascript (application/javascript)</option>
//   <option value="application/xml">XML (application/xml)</option>
//   <option value="text/xml">XML (text/xml)</option>
//   <option value="text/html">HTML (text/html)</option>
// </select>


RawBodyTypeSelect.propTypes = {
  newRequestBody: PropTypes.object.isRequired,
  setNewRequestBody: PropTypes.func.isRequired,
};

export default RawBodyTypeSelect;
