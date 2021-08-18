import React from 'react';

const OpenAPIEntryForm = ({
  warningMessage,

  newRequestsOpenAPI,
}) => {
  const primaryServer = newRequestsOpenAPI?.openapiMetadata?.serverUrls[0];

  const openAPILabel = 'OpenAPI';

  return (
    <div className={`ml-2 mr-2 is-flex is-justify-content-center `}>
      <button className="button is-openapi">
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
