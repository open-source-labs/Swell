/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import dropDownArrow from '../../../../assets/icons/arrow_drop_down_white_192x192.png';

const GraphQLMethodAndEndpointEntryForm = ({
  warningMessage,
  setWarningMessage,
  fieldsReplaced,
  newRequestFields,
  newRequestBodySet,
  newRequestBody,
  newRequestHeadersSet,
  newRequestStreams,
  newRequestHeaders: { headersArr },
}) => {
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

  const warningCheck = () => {
    if (warningMessage.uri) {
      const newWarningMessage = { ...warningMessage };
      delete warningMessage.uri;
      setWarningMessage({ ...newWarningMessage });
    }
  };

  const urlChangeHandler = (e) => {
    warningCheck();
    const url = e.target.value;

    fieldsReplaced({
      ...newRequestFields,
      gqlUrl: url,
      url,
    });
  };

  const methodChangeHandler = (value) => {
    warningCheck();

    let newBody;
    const methodReplaceRegex = new RegExp(`${newRequestFields.method}`, 'mi');
    // GraphQL features
    if (value === 'QUERY') {
      if (!newRequestFields.graphQL) {
      } else {
        newBody = methodReplaceRegex.test(newRequestBody.bodyContent)
          ? newRequestBody.bodyContent.replace(methodReplaceRegex, 'query')
          : `${newRequestBody.bodyContent}`;
      }
      newRequestBodySet({
        ...newRequestBody,
        bodyContent: newBody,
        bodyIsNew: false,
      });
    } else if (value === 'MUTATION') {
      newBody = methodReplaceRegex.test(newRequestBody.bodyContent)
        ? newRequestBody.bodyContent.replace(methodReplaceRegex, 'mutation')
        : `${newRequestBody.bodyContent}`;

      newRequestBodySet({
        ...newRequestBody,
        bodyContent: newBody,
        bodyIsNew: false,
      });
    } else if (value === 'SUBSCRIPTION') {
      newBody = methodReplaceRegex.test(newRequestBody.bodyContent)
        ? newRequestBody.bodyContent.replace(methodReplaceRegex, 'subscription')
        : `${newRequestBody.bodyContent}`;

      newRequestBodySet({
        ...newRequestBody,
        bodyContent: newBody,
        bodyIsNew: false,
      });
    }

    fieldsReplaced({
      ...newRequestFields,
      method: value,
      protocol: value === 'SUBSCRIPTION' ? 'ws://' : '',
    });
  };

  const isDark = useSelector((store) => store.ui.isDark);

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
            <span>{newRequestFields.method}</span>
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
            {newRequestFields.method !== 'QUERY' && (
              <a
                onClick={() => {
                  setDropdownIsActive(false);
                  methodChangeHandler('QUERY');
                }}
                className="dropdown-item"
              >
                QUERY
              </a>
            )}
            {newRequestFields.method !== 'MUTATION' && (
              <a
                onClick={() => {
                  setDropdownIsActive(false);
                  methodChangeHandler('MUTATION');
                }}
                className="dropdown-item"
              >
                MUTATION
              </a>
            )}
            {newRequestFields.method !== 'SUBSCRIPTION' && (
              <a
                onClick={() => {
                  setDropdownIsActive(false);
                  methodChangeHandler('SUBSCRIPTION');
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
          value={newRequestFields.gqlUrl}
          onChange={(e) => {
            urlChangeHandler(e);
          }}
        />
      </div>

      {warningMessage.uri && (
        <div className="warningMessage">{warningMessage.uri}</div>
      )}
    </div>
  );
};

export default GraphQLMethodAndEndpointEntryForm;
