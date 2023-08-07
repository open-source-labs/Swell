import React, { useEffect } from 'react';
import WWWForm from './WWWForm';
import BodyTypeSelect from '../requestButtons/BodyTypeSelect';
import JSONTextArea from '../JSONTextArea';
import RawBodyTypeSelect from '../requestButtons/RawBodyTypeSelect';
import JSONPrettify from '../requestButtons/JSONPrettifyButton';
import TextCodeArea from '../TextCodeArea';

import { NewRequestBody, NewRequestBodySet, NewRequestHeaders, NewRequestHeadersSet} from '../../../../../types';
// import { Interface } from 'readline';

// import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
// import ContentReqRowComposer from './ContentReqRowComposer.tsx';

// import { useState, useEffect } from 'react';
// import { Form } from 'react-router-dom';



type BodyEntryFormProps = {
  newRequestHeaders: NewRequestHeaders,
  newRequestBody: NewRequestBody,
  newRequestBodySet: NewRequestBodySet,
  newRequestHeadersSet: NewRequestHeadersSet,
  warningMessage: {
    err?: string
    uri?: string
    body?: string
    json?: string
  }
  isMockServer?: boolean
  placeholder?: string
}

const BodyEntryForm = (props: BodyEntryFormProps) => {
  const {
    newRequestBody,
    newRequestBodySet,
    newRequestHeaders,
    newRequestHeadersSet,
    warningMessage,
    isMockServer
  } = props;

  useEffect(() => {
    if (isMockServer) {
      newRequestBodySet({
        ...newRequestBody,
        bodyType: 'raw',
        bodyContent: '',
      });
    }
  }, [isMockServer]);

  const bodyEntryArea = () => {
    //BodyType of none : display nothing
    if (newRequestBody.bodyType === 'none') {
      return;
    }
    //BodyType of XWWW... : display WWWForm entry
    if (newRequestBody.bodyType === 'x-www-form-urlencoded') {
      return (
        <div>
        <WWWForm
          newRequestBodySet={newRequestBodySet}
          newRequestBody={newRequestBody}
        />
        </div>
      );
    }
    //RawType of application/json : Text area box with error checking
    if (newRequestBody.rawType === 'application/json') {
      return (
        <JSONTextArea
          newRequestBodySet={newRequestBodySet}
          newRequestBody={newRequestBody}
        />
      );
    }

    return (
      <TextCodeArea
        mode={newRequestBody.rawType}
        value={newRequestBody.bodyContent}
        onChange={(value, viewUpdate) => {
          newRequestBodySet({
            ...newRequestBody,
            bodyContent: value,
          });
        }}
        placeholder={props.placeholder}
      />
    );
  };

  return (
    <div className="mt-1">
      <div className="composer-section-title">Body</div>
      <div className="is-flex is-align-items-center is-justify-content-space-between">
        <span className="is-flex is-align-items-center">
          <BodyTypeSelect
            newRequestBodySet={newRequestBodySet}
            newRequestBody={newRequestBody}
            newRequestHeadersSet={newRequestHeadersSet}
            newRequestHeaders={newRequestHeaders}
          />

          {/* DROP DOWN MENU FOR SELECTING RAW TEXT TYPE */}
          {newRequestBody.bodyType === 'raw' && (
            <RawBodyTypeSelect
              newRequestBodySet={newRequestBodySet}
              newRequestBody={newRequestBody}
              newRequestHeadersSet={newRequestHeadersSet}
              newRequestHeaders={newRequestHeaders}
            />
          )}
        </span>
        {newRequestBody.bodyType === 'raw' &&
          newRequestBody.rawType === 'application/json' && (
            <JSONPrettify
              newRequestBody={newRequestBody}
              newRequestBodySet={newRequestBodySet}
            />
          )}
      </div>

      {
        // conditionally render warning message
        warningMessage ? (
          <div>
            <div>{warningMessage.body || warningMessage.json}</div>
          </div>
        ) : null
      }
      <div className="mt-2" id="body-entry-select">
        {bodyEntryArea()}
      </div>
    </div>
  );
};

export default BodyEntryForm;


