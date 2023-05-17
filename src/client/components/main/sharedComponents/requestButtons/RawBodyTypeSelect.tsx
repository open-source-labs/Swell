/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

/** @todo Remove propTypes check when component is converted to TypeScript*/
import PropTypes from 'prop-types';

import React, { useState, useRef, useEffect } from 'react';
import dropDownArrow from '../../../../../assets/icons/caret-down.svg';

interface RawBodyTypeSelectProps {
  newRequestBodySet: (value: any) => void;
  newRequestBody: any;
  newRequestHeadersSet: (value: any) => void;
  newRequestHeaders: any;
}

interface RequestHeader {
  id: number;
  active: boolean;
  key: string;
  value: string;
}

const RawBodyTypeSelect: React.FC<RawBodyTypeSelectProps> = (props) => {
  const { newRequestBodySet, newRequestBody, newRequestHeadersSet, newRequestHeaders } = props;
  const [dropdownIsActive, setDropdownIsActive] = useState<boolean>(false);
  const dropdownEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeDropdown = (event: MouseEvent) => {
      if (dropdownEl.current && !dropdownEl.current.contains(event.target as Node)) {
        setDropdownIsActive(false);
      }
    };
    document.addEventListener('click', closeDropdown);
    return () => document.removeEventListener('click', closeDropdown);
  }, []);

  const setNewRawBodyType = (rawTypeStr: string) => {
    newRequestBodySet({
      ...newRequestBody,
      rawType: rawTypeStr,
    });
    const headersCopy = JSON.parse(JSON.stringify(newRequestHeaders));
    headersCopy.headersArr[0] = {
      id: Math.random() * 1000000,
      active: true,
      key: 'Content-type',
      value: rawTypeStr,
    } as RequestHeader;
    newRequestHeadersSet({
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
          className="button is-small is-primary is-outlined"
          id="raw-body-type"
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
              alt="dropdown arrow"
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

export default RawBodyTypeSelect;

/** @todo Remove propTypes check when component is converted to TypeScript*/
// RawBodyTypeSelect.propTypes = {
//   newRequestBody: PropTypes.object.isRequired,
//   newRequestBodySet: PropTypes.func.isRequired,
// };

// export default RawBodyTypeSelect;
