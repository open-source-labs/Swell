import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import dropDownArrow from "../../../../assets/icons/caret-down-white.svg";

const classNames = require("classnames");

const BodyTypeSelect = (props) => {
  const {
    setNewRequestBody,
    newRequestBody,
    setNewRequestHeaders,
    newRequestHeaders,
  } = props;

  const [dropdownIsActive, setDropdownIsActive] = useState();
  const dropdownEl = useRef();

  useEffect(() => {
    const closeDropdown = (event) => {
      if (!dropdownEl.current.contains(event.target)) {
        setDropdownIsActive(false);
      }
    };
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  const removeContentTypeHeader = () => {
    const filtered = newRequestHeaders.headersArr.filter(
      (header) => header.key.toLowerCase() !== "content-type"
    );
    setNewRequestHeaders({
      headersArr: filtered,
      count: filtered.length,
    });
  };

  const setNewBodyType = (bodyTypeStr) => {
    setNewRequestBody({
      ...newRequestBody,
      bodyType: bodyTypeStr,
    });
  };

  const setContentTypeHeader = (newBodyType) => {
    const headersCopy = JSON.parse(JSON.stringify(newRequestHeaders));
    headersCopy.headersArr[0] = {
      id: Math.random() * 1000000,
      active: true,
      key: "Content-type",
      value: newBodyType,
    };
    setNewRequestHeaders({
      headersArr: headersCopy.headersArr,
    });
  };

  return (
    <div
      ref={dropdownEl}
      className={`mt-1 mb- dropdown ${dropdownIsActive ? "is-active" : ""}`}
    >
      <div className="dropdown-trigger">
        <button
          className="button is-small is-outlined is-primary mr-3 add-header-or-cookie-button"
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
            />
          </span>
        </button>
      </div>

      <div className="dropdown-menu">
        <ul className="dropdown-content">
          {newRequestBody.bodyType !== "raw" && (
            <a
              onClick={() => {
                setDropdownIsActive(false);
                setNewBodyType("raw");
                setContentTypeHeader("text/plain");
              }}
              className="dropdown-item"
            >
              raw
            </a>
          )}
          {newRequestBody.bodyType !== "x-www-form-urlencoded" && (
            <a
              onClick={() => {
                setDropdownIsActive(false);
                setContentTypeHeader("x-www-form-urlencoded");
                setNewBodyType("x-www-form-urlencoded");
              }}
              className="dropdown-item"
            >
              x-www-form-urlencoded
            </a>
          )}
          {newRequestBody.bodyType !== "none" && (
            <a
              onClick={() => {
                setDropdownIsActive(false);
                setNewBodyType("none");
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

BodyTypeSelect.propTypes = {
  newRequestBody: PropTypes.object.isRequired,
  setNewRequestBody: PropTypes.func.isRequired,
};

export default BodyTypeSelect;
