/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import dropDownArrow from './../../../../assets/icons/arrow_drop_down_white_192x192.png';

import { RootState } from '../../../toolkit-refactor/store';
import { fieldsReplaced } from '../../../toolkit-refactor/slices/newRequestFieldsSlice';

const TRPCMethodAndEndpointEntryForm = (props) => {
  const [dropdownIsActive, setDropdownIsActive] = useState(false);
  const dropdownEl = useRef();
  const requestFields = useSelector(
    (state: RootState) => state.newRequestFields
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const closeDropdown = (event: MouseEvent) => {
      if (!dropdownEl.current.contains(event.target)) {
        setDropdownIsActive(false);
      }
    };
    document.addEventListener('click', closeDropdown);
    dispatch(
      fieldsReplaced({
        ...requestFields,
        url: 'http://',
        method: 'Query/Mutate',
        protocol: 'http://',
      })
    );
    return () => document.removeEventListener('click', closeDropdown);
  }, []);

  const populateUrl = (request: string) => {
    let PROTOCOL;
    const urlAction: string = request;

    if (urlAction === 'Query/Mutate') {
      PROTOCOL = 'http://';
      props.proceduresDipatch({ type: 'HTTP' });
    } else if (urlAction === 'SUBSCRIPTION') {
      PROTOCOL = 'ws://';
      props.proceduresDipatch({ type: 'SUBSCRIPTION' });
    }
    dispatch(
      fieldsReplaced({
        ...requestFields,
        url: PROTOCOL,
        method: urlAction,
        protocol: PROTOCOL,
      })
    );
  };

  const urlChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url: string = e.target.value;

    dispatch(
      fieldsReplaced({
        ...requestFields,
        url: url,
      })
    );
  };

  const isDark = useSelector((store: RootState) => store.ui.isDark);

  return (
    <div>
      <div
        ref={dropdownEl}
        className={`is-flex is-justify-content-center dropdown ${
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
            {requestFields.method !== 'Query/Mutate' && (
              <a
                onClick={(e) => {
                  setDropdownIsActive(false);
                  populateUrl('Query/Mutate');
                }}
                className="dropdown-item"
              >
                Query/Mutate
              </a>
            )}
            {requestFields.method !== 'SUBSCRIPTION' && (
              <a
                onClick={(e) => {
                  setDropdownIsActive(false);
                  populateUrl('SUBSCRIPTION');
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
          value={requestFields.url}
          onChange={(e) => {
            urlChangeHandler(e);
          }}
        />
      </div>
    </div>
  );
};

export default TRPCMethodAndEndpointEntryForm;

