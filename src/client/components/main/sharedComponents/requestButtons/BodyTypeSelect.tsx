import React, { useState, useRef, useEffect } from 'react';
import dropDownArrow from '../../../../../assets/icons/caret-down.svg';
import { useAppDispatch, useAppSelector } from '../../../../toolkit-refactor/hooks';

import {
  $TSFixMeObject, CookieOrHeader,
} from '../../../../../../src/types';

import {
  newRequestBodySet,
  newRequestHeadersSet,
} from '../../../../toolkit-refactor/slices/newRequestSlice';

const BodyTypeSelect = () => {
  const dispatch = useAppDispatch();

  // Selectors
  const newRequestBody = useAppSelector(
    (state) => state.newRequest.newRequestBody
  );

  const newRequestHeaders = useAppSelector(
    (state) => state.newRequest.newRequestHeaders
  );

  // Dispatchers
  
  const newRequestHeadersSetAction = (requestHeadersObj: $TSFixMeObject) =>
  dispatch(newRequestHeadersSet(requestHeadersObj));

  const newRequestBodySetAction = (requestBodyObj: $TSFixMeObject) =>
    dispatch(newRequestBodySet(requestBodyObj));

  // React state for this page
  const [dropdownIsActive, setDropdownIsActive] = useState<boolean>();
  const dropdownEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeDropdown = (event: MouseEvent) => {
      if (
        dropdownEl.current &&
        !dropdownEl.current.contains(event.target as Node)
      ) {
        setDropdownIsActive(false);
      }
    };
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  const removeContentTypeHeader = () => {
    const filtered = newRequestHeaders.headersArr.filter(
      (header: any) => header.key.toLowerCase() !== "content-type"
    );

    newRequestHeadersSetAction({
      headersArr: filtered,
      count: filtered.length,
    })
  };

  const setNewBodyType = (bodyTypeStr: string) => {
    newRequestBodySetAction({
      ...newRequestBody,
      bodyType: bodyTypeStr,
    })
  };

  const setContentTypeHeader = (newBodyType: string) => {
    const headersCopy = JSON.parse(JSON.stringify(newRequestHeaders));
    headersCopy.headersArr[0] = {
      id: Math.random() * 1000000,
      active: true,
      key: "Content-Type",
      value: newBodyType,
    };
    newRequestHeadersSetAction({
      headersArr: headersCopy.headersArr,
    })
  };
  
  return (
    <div
      ref={dropdownEl}
      className={`mt-1 mb- dropdown ${dropdownIsActive ? "is-active" : ""}`}
    >
      <div className="dropdown-trigger">
        <button
          className="button is-small is-outlined is-primary mr-3"
          id="body-type-select"
          aria-haspopup="true"
          aria-controls="dropdown-menu"
          onClick={() => setDropdownIsActive(!dropdownIsActive)}
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
                setDropdownIsActive(false);
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
                setDropdownIsActive(false);
                setContentTypeHeader('x-www-form-urlencoded');
                setNewBodyType('x-www-form-urlencoded');
              }}
              className="dropdown-item"
            >
              x-www-form-urlencoded
            </a>
          )}
          {newRequestBody.bodyType !== 'binary' && (
            <a
              onClick={() => {
                setDropdownIsActive(false);
                setNewBodyType('binary');
                setContentTypeHeader('application/binary');
              }}
              className="dropdown-item"
            >
              binary
            </a>
          )}
          {newRequestBody.bodyType !== 'none' && (
            <a
              onClick={() => {
                setDropdownIsActive(false);
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
}

export default BodyTypeSelect