/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../toolkit-refactor/hooks';

import dropDownArrow from './../../../../assets/icons/arrow_drop_down_white_192x192.png';

//TODO: implicit any used throughout this file
const TRPCPrceduresEndPoint = (props) => {
  const [dropdownIsActive, setDropdownIsActive] = useState(false);
  const dropdownEl = useRef();

  useEffect(() => {
    const closeDropdown = (event: MouseEvent) => {
      if (!dropdownEl.current.contains(event.target)) {
        setDropdownIsActive(false);
      }
    };
    document.addEventListener('click', closeDropdown);
    return () => document.removeEventListener('click', closeDropdown);
  }, []);

  /// these functions exists to dispatch function to the reducer function inside of main trpc composer file.
  const methodHandler = (method) => {
    props.proceduresDipatch({
      type: 'METHOD',
      payload: { index: props.index, value: method },
    });
  };
  const onChangeHandler = (e) => {
    props.proceduresDipatch({
      type: 'ENDPOINT',
      payload: { index: props.index, value: e.target.value },
    });
  };
  const onDeleteHandler = (e) => {
    props.proceduresDipatch({
      type: 'DELETE',
      payload: { index: props.index },
    });
  };
  const isDark = useAppSelector((store: { ui: { isDark: boolean } }) => store.ui.isDark);

  return (
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
          <span>{props.procedureData.method}</span>
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
          {props.procedureData.method !== 'QUERY' && (
            <a
              onClick={(e) => {
                setDropdownIsActive(false);
                methodHandler('QUERY');
              }}
              className="dropdown-item"
            >
              QUERY
            </a>
          )}
          {props.procedureData.method !== 'MUTATE' && (
            <a
              onClick={(e) => {
                setDropdownIsActive(false);
                methodHandler('MUTATE');
              }}
              className="dropdown-item"
            >
              MUTATE
            </a>
          )}
        </ul>
      </div>

      <input
        className={`${
          isDark ? 'dark-address-input' : ''
        } ml-1 input input-is-medium is-info`}
        type="text"
        id="url-input"
        placeholder="Enter endpoint"
        value={props.procedureData.endpoint}
        onChange={onChangeHandler}
      />

      <div className="is-flex is-justify-content-center is-align-items-center ml-4">
        <div className="delete m-auto" onClick={onDeleteHandler} />
      </div>
    </div>
  );
};

export default TRPCPrceduresEndPoint;

