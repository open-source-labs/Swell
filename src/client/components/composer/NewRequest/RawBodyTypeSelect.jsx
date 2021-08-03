import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import dropDownArrow from '../../../../assets/icons/caret-down.svg';

const classNames = require('classnames');

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
    };
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
    });
    const headersCopy = JSON.parse(JSON.stringify(newRequestHeaders));
    headersCopy.headersArr[0] = {
      id: Math.random() * 1000000,
      active: true,
      key: 'Content-type',
      value: rawTypeStr,
    };
    setNewRequestHeaders({
      headersArr: headersCopy.headersArr,
    });
  };

  return (
    <div
      ref={dropdownEl}
      className={`mt-1  mr-3 dropdown ${dropdownIsActive ? 'is-active' : ''}`}
    >
      <div className="dropdown-trigger">
        <button
          className="button is-small is-primary is-outlined add-header-or-cookie-button"
          aria-haspopup="true"
          aria-controls="dropdown-menu"
          onClick={() => setDropdownIsActive(!dropdownIsActive)}
        >
          <span>{newRequestBody.rawType}</span>
          <span className="icon is-small">
            <img
              src={dropDownArrow}
              className="is-awesome-icon"
              aria-hidden="true"
            />
          </span>
        </button>
      </div>

      <div className="dropdown-menu">
        <ul className="dropdown-content">
          {newRequestBody.rawType !== 'text/plain' && (
            <a
              onClick={() => {
                setDropdownIsActive(false);
                setNewRawBodyType('text/plain');
              }}
              className="dropdown-item"
            >
              text/plain
            </a>
          )}
          {newRequestBody.rawType !== 'application/json' && (
            <a
              onClick={() => {
                setDropdownIsActive(false);
                setNewRawBodyType('application/json');
              }}
              className="dropdown-item"
            >
              application/json
            </a>
          )}
          {newRequestBody.rawType !== 'application/javascript' && (
            <a
              onClick={() => {
                setDropdownIsActive(false);
                setNewRawBodyType('application/javascript');
              }}
              className="dropdown-item"
            >
              application/javascript
            </a>
          )}
          {newRequestBody.rawType !== 'application/xml' && (
            <a
              onClick={() => {
                setDropdownIsActive(false);
                setNewRawBodyType('application/xml');
              }}
              className="dropdown-item"
            >
              application/xml
            </a>
          )}
          {newRequestBody.rawType !== 'text/xml' && (
            <a
              onClick={() => {
                setDropdownIsActive(false);
                setNewRawBodyType('text/xml');
              }}
              className="dropdown-item"
            >
              text/xml
            </a>
          )}
          {newRequestBody.rawType !== 'text/html' && (
            <a
              onClick={() => {
                setDropdownIsActive(false);
                setNewRawBodyType('text/html');
              }}
              className="dropdown-item"
            >
              text/html
            </a>
          )}
        </ul>
      </div>
    </div>
  );
};

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
