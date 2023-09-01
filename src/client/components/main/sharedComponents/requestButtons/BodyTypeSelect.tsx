import React from 'react';
import dropDownArrow from '~/assets/icons/caret-down.svg';
import useDropdownState from '~/hooks/useDropdownState';

interface Props {
  newRequestBodySet: (value: any) => void;
  newRequestBody: any;
  newRequestHeadersSet: (value: any) => void;
  newRequestHeaders: any;
}

const BodyTypeSelect = ({
  newRequestBodySet,
  newRequestBody,
  newRequestHeadersSet,
  newRequestHeaders,
}: Props) => {
  const { dropdownIsOpen, dropdownRef, toggleDropdown, closeDropdown } =
    useDropdownState();

  const removeContentTypeHeader = () => {
    const filtered = newRequestHeaders.headersArr.filter(
      (header: any) => header.key.toLowerCase() !== 'content-type'
    );
    newRequestHeadersSet({
      headersArr: filtered,
      count: filtered.length,
    });
  };

  const setNewBodyType = (bodyTypeStr: string) => {
    newRequestBodySet({
      ...newRequestBody,
      bodyType: bodyTypeStr,
    });
  };

  const setContentTypeHeader = (newBodyType: string) => {
    const headersCopy = JSON.parse(JSON.stringify(newRequestHeaders));
    headersCopy.headersArr[0] = {
      id: Math.random() * 1000000,
      active: true,
      key: 'Content-type',
      value: newBodyType,
    };
    newRequestHeadersSet({
      headersArr: headersCopy.headersArr,
    });
  };

  return (
    <div
      ref={dropdownRef}
      className={`mt-1 mb- dropdown ${dropdownIsOpen ? 'is-active' : ''}`}
    >
      <div className="dropdown-trigger">
        <button
          className="button is-small is-outlined is-primary mr-3"
          id="body-type-select"
          aria-haspopup="true"
          aria-controls="dropdown-menu"
          onClick={toggleDropdown}
        >
          <span>{newRequestBody.bodyType}</span>
          <span className="icon is-small">
            <img
              src={dropDownArrow}
              className="is-awesome-icon"
              aria-hidden="true"
              alt="Dropdown arrow"
            />
          </span>
        </button>
      </div>

      <div className="dropdown-menu">
        <ul className="dropdown-content">
          {newRequestBody.bodyType !== 'raw' && (
            <a
              onClick={() => {
                closeDropdown();
                setNewBodyType('raw');
                setContentTypeHeader('text/plain');
              }}
              className="dropdown-item"
            >
              raw
            </a>
          )}
          {newRequestBody.bodyType !== 'x-www-form-urlencoded' && (
            <a
              onClick={() => {
                closeDropdown();
                setContentTypeHeader('x-www-form-urlencoded');
                setNewBodyType('x-www-form-urlencoded');
              }}
              className="dropdown-item"
            >
              x-www-form-urlencoded
            </a>
          )}
          {newRequestBody.bodyType !== 'none' && (
            <a
              onClick={() => {
                closeDropdown();
                setNewBodyType('none');
                removeContentTypeHeader();
              }}
              className="dropdown-item"
            >
              none
            </a>
          )}
        </ul>
      </div>
    </div>
  );
};

export default BodyTypeSelect;
