/* eslint-disable default-case */
import React from 'react';

const OpenAPIEntryForm = ({
  warningMessage,
  setComposerWarningMessage,
  setNewRequestFields,
  setNewRequestsOpenAPI,
  newRequestFields,
  newRequestsOpenAPI,
}) => {
  const warningCheck = () => {
    if (warningMessage.uri) {
      const warningMessage = { ...warningMessage };
      delete warningMessage.uri;
      setComposerWarningMessage({ ...warningMessage });
    }
  };

  const primaryServer = newRequestsOpenAPI?.openapiMetadata?.serverUrls[0];

  // const urlChangeHandler = (e) => {
  //   warningCheck();
  //   const url = e.target.value;
  //   setNewRequestsOpenAPI({
  //     ...newRequestsOpenAPI,
  //     openapiUrl: newRequestsOpenAPI.openapiMetadata.serverUrls[0],
  //     url,
  //   });
  // };

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
        placeholder="primary server loads here..."
        value={primaryServer}
      />
      {warningMessage.uri && (
        <div className="warningMessage">{warningMessage.uri}</div>
      )}
    </div>
  );
};

export default OpenAPIEntryForm;
