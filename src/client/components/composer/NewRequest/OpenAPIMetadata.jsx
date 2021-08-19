import React from 'react';

function OpenAPIMetaData({ newRequestsOpenAPI }) {
  return (
    <div className="mt-2 mb-2">
      <div className="is-flex is-justify-content-space-between is-align-content-center mb-4">
        <div className="composer-section-title">Metadata</div>
      </div>
      <div className="is-flex is-justify-content-space-between is-align-content-center">
        <div className="mb-1">Title</div>
        {newRequestsOpenAPI?.openapiMetadata?.info.title
          ? newRequestsOpenAPI.openapiMetadata.info.title
          : ''}
      </div>
      <div className="is-flex is-justify-content-space-between is-align-content-center">
        <div className="mb-1">Info</div>
        {newRequestsOpenAPI?.openapiMetadata?.info.description
          ? newRequestsOpenAPI.openapiMetadata.info.description
          : ''}
      </div>
      <div className="is-flex is-justify-content-space-between is-align-content-center">
        <div className="mb-1">Version</div>
        {newRequestsOpenAPI?.openapiMetadata?.info.version
          ? newRequestsOpenAPI.openapiMetadata.info.version
          : ''}
      </div>
      <div className="is-flex is-justify-content-space-between is-align-content-center">
        <div className="mb-1">OpenAPI</div>
        {newRequestsOpenAPI?.openapiMetadata?.info.openapi
          ? newRequestsOpenAPI.openapiMetadata.info.openapi
          : ''}
      </div>
      <hr />
    </div>
  );
}

export default OpenAPIMetaData;
