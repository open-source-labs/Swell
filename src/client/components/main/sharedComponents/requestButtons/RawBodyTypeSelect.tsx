/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React from 'react';
import dropDownArrow from '~/assets/icons/caret-down.svg';
import useDropdownState from '~/hooks/useDropdownState';

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

const RawBodyTypeSelect: React.FC<RawBodyTypeSelectProps> = ({
  newRequestBodySet,
  newRequestBody,
  newRequestHeadersSet,
  newRequestHeaders,
}) => {
  const { dropdownIsOpen, dropdownRef, closeDropdown, toggleDropdown } =
    useDropdownState();

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
      ref={dropdownRef}
      className={`mt-1  mr-3 dropdown ${dropdownIsOpen ? 'is-active' : ''}`}
    >
      <div className="dropdown-trigger">
        <button
          className="button is-small is-primary is-outlined"
          id="raw-body-type"
          aria-haspopup="true"
          aria-controls="dropdown-menu"
          onClick={toggleDropdown}
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
                closeDropdown();
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
                closeDropdown();
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
                closeDropdown();
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
                closeDropdown();
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
                closeDropdown();
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
                closeDropdown();
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
