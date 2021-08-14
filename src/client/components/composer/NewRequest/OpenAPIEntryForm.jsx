/* eslint-disable default-case */
import React from 'react';

const OpenAPIEntryForm = ({
  warningMessage,
  setComposerWarningMessage,
  setNewRequestFields,
  newRequestFields,
}) => {
  const warningCheck = () => {
    if (warningMessage.uri) {
      const warningMessage = { ...warningMessage };
      delete warningMessage.uri;
      setComposerWarningMessage({ ...warningMessage });
    }
  };

  const urlChangeHandler = (e) => {
    warningCheck();
    const url = e.target.value;
    setNewRequestFields({
      ...newRequestFields,
      openapiUrl: url,
      url,
    });
  };

  // TO DO
  // change this to be initial state instead
  const openAPILabel = 'OpenAPI';

  return (
    <div className={`ml-2 mr-2 is-flex is-justify-content-center `}>
      {/* button id is now stream for vanilla JS selector, this should change */}
      <button id="stream" className="button is-openapi">
        <span>{openAPILabel}</span>
      </button>
      <input
        className="ml-1 input input-is-medium is-info"
        type="text"
        placeholder="What goes here?"
        value={newRequestFields.openapiUrl}
        onChange={(e) => {
          urlChangeHandler(e);
        }}
      />
      {warningMessage.uri && (
        <div className="warningMessage">{warningMessage.uri}</div>
      )}
    </div>
  );
};

export default OpenAPIEntryForm;
