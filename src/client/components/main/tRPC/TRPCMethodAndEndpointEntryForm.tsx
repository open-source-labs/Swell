/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import dropDownArrow from '../../../../assets/icons/arrow_drop_down_white_192x192.png';
import { RootState } from '../../../toolkit-refactor/store';
import { fieldsReplaced } from '../../../toolkit-refactor/newRequestFields/newRequestFieldsSlice';
import e from 'express';

const TRPCMethodAndEndpointEntryForm = () => {
  const [dropdownIsActive, setDropdownIsActive] = useState(false);
  const dropdownEl = useRef();
  const requestFields = useSelector((state: RootState) => state.newRequestFields)
  const dispatch = useDispatch();

  useEffect(() => {
    const closeDropdown = (event) => {
      if (!dropdownEl.current.contains(event.target)) {
        setDropdownIsActive(false);
      }
    };
    document.addEventListener('click', closeDropdown);
    return () => document.removeEventListener('click', closeDropdown);
  }, []);

  const populateUrl = (request: string) => {
    const url: string = request;
    const classToValue = document.getElementById('url-input') as HTMLInputElement;
    if (url === 'QUERY' || url === 'MUTATE') {
    classToValue.value = requestFields.url; 
  }
  else if (url === 'SUBSCRIPTION') {
    console.log(requestFields.wsUrl);
    classToValue.value = requestFields.wsUrl; 
    }
  }

  const urlChangeHandler = (e) => {
    const url: string = e.target.value;

    dispatch(fieldsReplaced({
      ...requestFields,
      url: url,
    }));
  };

  // const methodChangeHandler = (selectedMethod: string) => {
  //   // GraphQL group had this method change handler modify the body of the query
  //   dispatch(fieldsReplaced({
  //     ...requestFields,
  //     method: selectedMethod,
  //     protocol: selectedMethod === 'SUBSCRIPTION' ? 'ws://' : '',
  //   }));
  // };

  const methodChangeHandler = (selectedMethod: string) => {
    // GraphQL group had this method change handler modify the body of the query
    dispatch(fieldsReplaced({
      ...requestFields,
      method: selectedMethod,
    }));
  };

  const isDark = useSelector((store: RootState) => store.ui.isDark);

  return (
    <div>
      <div
        ref={dropdownEl}
        className={`ml-2 mr-2 is-flex is-justify-content-center dropdown ${
          dropdownIsActive ? 'is-active' : ''
        }`}
        style={{ padding: '10px' }}
      >
        <div className="dropdown-trigger">
          <button
            className="no-border-please button is-graphQL"
            id="graphql-method"
            aria-haspopup="true"
            aria-controls="dropdown-menu"
            onClick={() => setDropdownIsActive(!dropdownIsActive)}
          >
            <span>{requestFields.method}</span>
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

        <div className="dropdown-menu" id="dropdown-menu">
          <ul className="dropdown-content">
            {requestFields.method !== 'QUERY' && (
              <a
                onClick={(e) => {
                  setDropdownIsActive(false);
                  methodChangeHandler('QUERY');
                  populateUrl('QUERY')
                  
                }}
                className="dropdown-item"
              >
                QUERY
              </a>
            )}
            {requestFields.method !== 'MUTATE' && (
              <a
                onClick={(e) => {
                  setDropdownIsActive(false);
                  methodChangeHandler('MUTATE');
                  populateUrl ('MUTATE')
                }}
                className="dropdown-item"
              >
                MUTATE
              </a>
            )}
            {requestFields.method !== 'SUBSCRIPTION' && (
              <a
                onClick={(e) => {
                  setDropdownIsActive(false);
                  methodChangeHandler('SUBSCRIPTION');
                  populateUrl('SUBSCRIPTION')
                }}
                className="dropdown-item"
              >
                SUBSCRIPTION
              </a>
            )}
          </ul>
        </div>

        <input
          className={`${
            isDark ? 'is-dark-300' : ''
          } ml-1 input input-is-medium is-info`}
          type="text"
          id="url-input"
          placeholder="Enter endpoint"
          onChange={(e) => {
            urlChangeHandler(e)}
          }
        />
      </div>

      {/* {warningMessage.uri && (
        <div className="warningMessage">{warningMessage.uri}</div>
      )} */}
    </div>
  );
};

export default TRPCMethodAndEndpointEntryForm;
