import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { GraphQLSchema } from 'graphql';

import dropDownArrow from '../../../../assets/icons/arrow_drop_down_white_192x192.png';
import { NewRequestFields, NewRequestBody } from '../../../../types';

interface IntrospectionData {
  schemaSDL: string | null;
  clientSchema: GraphQLSchema | null;
}

interface Props {
  warningMessage: { uri?: string };
  setWarningMessage: (message: { uri?: string }) => void;
  fieldsReplaced: (fields: NewRequestFields) => void;
  newRequestFields: NewRequestFields;
  newRequestBodySet: (body: { [key: string]: any }) => void;
  newRequestBody: NewRequestBody;
}

const GraphQLMethodAndEndpointEntryForm: React.FC<Props> = ({
  warningMessage,
  setWarningMessage,
  fieldsReplaced,
  newRequestFields,
  newRequestBodySet,
  newRequestBody,
}) => {
  const [dropdownIsActive, setDropdownIsActive] = useState<boolean>(false);
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
    document.addEventListener('click', closeDropdown);
    return () => document.removeEventListener('click', closeDropdown);
  }, []);

  const clearWarningIfApplicable = () => {
    if (warningMessage.uri) setWarningMessage({});
  };

  const urlChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearWarningIfApplicable();
    const url = e.target.value;

    fieldsReplaced({
      ...newRequestFields,
      gqlUrl: url,
      url,
    });
  };

  const methodChangeHandler = (value: string) => {
    clearWarningIfApplicable();

    let methodReplaceRegexType: string | undefined

    const methodReplaceRegex = new RegExp(`${newRequestFields.method}`, 'mi');
    // GraphQL features
    if (value === 'QUERY' || 'MUTATION' || 'SUBSCRIPTION') {
      if (value === 'QUERY') {
        methodReplaceRegexType = 'query'
      } 
      else if (value === 'MUTATION') {
        methodReplaceRegexType = 'mutation'
      } 
      else if (value === 'SUBSCRIPTION') {
        methodReplaceRegexType = 'subscription'
      }

      const newBody = methodReplaceRegex.test(newRequestBody.bodyContent)
      ? newRequestBody.bodyContent.replace(methodReplaceRegex, methodReplaceRegexType)
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


  const isDark = useSelector((store: { ui: { isDark: boolean } }) => store.ui.isDark);

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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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

