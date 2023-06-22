/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import dropDownArrow from './../../../../assets/icons/arrow_drop_down_white_192x192.png';

import { RootState } from '../../../toolkit-refactor/store';
import { fieldsReplaced } from '../../../toolkit-refactor/slices/newRequestFieldsSlice';

const TRPCPrceduresEndPoint = (props) => {
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
    return () => document.removeEventListener('click', closeDropdown);
  }, []);

  const populateUrl = (request: string) => {
    props.setProcedureTypeHandler(request);
  };
  const onChangeHandler = (e) => {
    props.endPointChangeHandler(e.target.value);
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
            <span>{props.procedureType}</span>
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
            {props.procedureType !== 'QUERY' && (
              <a
                onClick={(e) => {
                  setDropdownIsActive(false);
                  populateUrl('QUERY');
                }}
                className="dropdown-item"
              >
                QUERY
              </a>
            )}
            {props.procedureType !== 'MUTATE' && (
              <a
                onClick={(e) => {
                  setDropdownIsActive(false);
                  populateUrl('MUTATE');
                }}
                className="dropdown-item"
              >
                MUTATE
              </a>
            )}
            {props.procedureType !== 'SUBSCRIPTION' && (
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
          onChange={onChangeHandler}
        />
        <div id="tRPCButton" className="no-border-please button is-webrtc">
          <span> Add Procedure</span>
        </div>
      </div>
    </div>
  );
};

export default TRPCPrceduresEndPoint;
