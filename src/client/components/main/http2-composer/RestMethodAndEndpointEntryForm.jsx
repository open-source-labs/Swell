import React, { useState, useRef, useEffect } from 'react';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../toolkit-refactor/hooks';
import dropDownArrow from '../../../../assets/icons/arrow_drop_down_white_192x192.png';

const RestMethodAndEndpointEntryForm = ({
  warningMessage,
  setWarningMessage,
  fieldsReplaced,
  newRequestFields,
  newRequestBodySet,
  newRequestBody,
  newTestContentSet,
  placeholder = 'Enter URL or paste text here',
  value,
}) => {
  const isDark = useAppSelector((state) => state.ui.isDark);
  const [dropdownIsActive, setDropdownIsActive] = useState(false);
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

  const clearWarningIfApplicable = () => {
    if (warningMessage.uri) setWarningMessage({});
  };

  const methodChangeHandler = (newMethodStr) => {
    clearWarningIfApplicable();
    //if one of 5 http methods (get, post, put, patch, delete)
    newRequestBodySet({
      ...newRequestBody,
      bodyType: 'raw',
      bodyContent: '',
    });

    //always set new method
    fieldsReplaced({
      ...newRequestFields,
      method: newMethodStr,
      protocol: '',
    });

    newTestContentSet('');
  };

  const urlChangeHandler = (e) => {
    clearWarningIfApplicable();
    const url = e.target.value;
    fieldsReplaced({
      ...newRequestFields,
      restUrl: url,
      url,
    });
  };

  return (
    <div>
      <div
        ref={dropdownEl}
        className={` is-flex is-justify-content-center dropdown ${
          dropdownIsActive ? 'is-active' : ''
        }`}
        style={{ padding: '10px' }}
      >
        <div className="dropdown-trigger">
          <button
            className="is-rest button no-border-please"
            id="rest-method"
            aria-haspopup="true"
            aria-controls="dropdown-menu"
            onClick={() => setDropdownIsActive(!dropdownIsActive)}
          >
            <span>{newRequestFields.method}</span>
            <span className="icon is-medium">
              <img
                src={dropDownArrow}
                className="arrow-drop-down is-awesome-icon"
                aria-hidden="true"
                alt="dropdown arrow"
              />
            </span>
          </button>
        </div>

        <div className="dropdown-menu" id="dropdown-menu">
          <ul className="dropdown-content">
            {newRequestFields.method !== 'GET' && (
              <a
                onClick={() => {
                  setDropdownIsActive(false);
                  methodChangeHandler('GET');
                }}
                className="dropdown-item"
              >
                GET
              </a>
            )}

            {newRequestFields.method !== 'POST' && (
              <a
                onClick={() => {
                  setDropdownIsActive(false);
                  methodChangeHandler('POST');
                }}
                className="dropdown-item"
              >
                POST
              </a>
            )}
            {newRequestFields.method !== 'PUT' && (
              <a
                onClick={() => {
                  setDropdownIsActive(false);
                  methodChangeHandler('PUT');
                }}
                className="dropdown-item"
              >
                PUT
              </a>
            )}
            {newRequestFields.method !== 'PATCH' && (
              <a
                onClick={() => {
                  setDropdownIsActive(false);
                  methodChangeHandler('PATCH');
                }}
                className="dropdown-item"
              >
                PATCH
              </a>
            )}
            {newRequestFields.method !== 'DELETE' && (
              <a
                onClick={() => {
                  setDropdownIsActive(false);
                  methodChangeHandler('DELETE');
                }}
                className="dropdown-item"
              >
                DELETE
              </a>
            )}
          </ul>
        </div>

        <input
          className={`${
            isDark ? 'dark-address-input' : ''
          } ml-1 input input-is-medium is-info`}
          id="url-input"
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={urlChangeHandler}
        />
      </div>

      {warningMessage.uri && (
        <div className="warningMessage">{warningMessage.uri}</div>
      )}
    </div>
  );
};

export default RestMethodAndEndpointEntryForm;
