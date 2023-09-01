/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { type ChangeEvent } from 'react';
import { useAppSelector } from '../../../rtk/store';
import useDropdownState from '~/hooks/useDropdownState';
import dropDownArrow from '~/assets/icons/arrow_drop_down_white_192x192.png';
import { type ProcedureAction } from './TRPCComposer';

type Props = {
  index: number;
  procedureData: { method: string; endpoint: string };
  proceduresDispatch: React.Dispatch<ProcedureAction>;
};

const TRPCProceduresEndPoint = ({
  procedureData,
  index,
  proceduresDispatch,
}: Props) => {
  const isDark = useAppSelector((state) => state.ui.isDark);
  const { dropdownIsOpen, dropdownRef, toggleDropdown, closeDropdown } =
    useDropdownState();

  const methodHandler = (method: 'QUERY' | 'MUTATE') => {
    proceduresDispatch({
      type: 'procedureUpdated',
      payload: { procedureIndex: index, key: 'method', newValue: method },
    });
  };

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    proceduresDispatch({
      type: 'procedureUpdated',
      payload: {
        procedureIndex: index,
        key: 'endpoint',
        newValue: e.target.value,
      },
    });
  };

  const onDeleteHandler = () => {
    proceduresDispatch({
      type: 'procedureDeleted',
      payload: { procedureIndex: index },
    });
  };

  return (
    <div
      ref={dropdownRef}
      className={`is-flex is-justify-content-center dropdown ${
        dropdownIsOpen ? 'is-active' : ''
      }`}
      style={{ padding: '10px' }}
    >
      <div className="dropdown-trigger">
        <button
          className="no-border-please button is-graphQL"
          id="graphql-method"
          aria-haspopup="true"
          aria-controls="dropdown-menu"
          onClick={toggleDropdown}
        >
          <span>{procedureData.method}</span>
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
          {procedureData.method !== 'QUERY' && (
            <button
              onClick={() => {
                closeDropdown();
                methodHandler('QUERY');
              }}
              className="dropdown-item"
            >
              QUERY
            </button>
          )}

          {procedureData.method !== 'MUTATE' && (
            <button
              onClick={() => {
                closeDropdown();
                methodHandler('MUTATE');
              }}
              className="dropdown-item"
            >
              MUTATE
            </button>
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
        value={procedureData.endpoint}
        onChange={onChangeHandler}
      />

      <div className="is-flex is-justify-content-center is-align-items-center ml-4">
        <div className="delete m-auto" onClick={onDeleteHandler} />
      </div>
    </div>
  );
};

export default TRPCProceduresEndPoint;

