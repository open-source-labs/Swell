import React from 'react';
import { $TSFixMe, OpenAPIRequest } from '../../../../types';

interface Props {
  newRequestsOpenAPI: OpenAPIRequest;
}

const OpenAPIMetaData: React.FC<Props> = (props: $TSFixMe) => {
  const { newRequestsOpenAPI } = props;

  const conditionalChecker = (key: string) => {
    if (newRequestsOpenAPI?.penAPIMetaData) {
      return newRequestsOpenAPI.openapiMetadata.info[key] ? newRequestsOpenAPI.openapiMetadata.info[key] : ''
    }
    return ''
  }
  
  return (
    <div className="mt-2 mb-2">
      <div className="is-flex is-justify-content-space-between is-align-content-center mb-4">
        <div className="composer-section-title">Metadata</div>
      </div>
      <div className="is-flex is-justify-content-space-between is-align-content-center">
        <div className="mb-1">Title</div>
        {conditionalChecker('title')}
      </div>
      <div className="is-flex is-justify-content-space-between is-align-content-center">
        <div className="mb-1">Info</div>
        {conditionalChecker('description')}

      </div>
      <div className="is-flex is-justify-content-space-between is-align-content-center">
        <div className="mb-1">Version</div>
        {conditionalChecker('version')}
      </div>
      <div className="is-flex is-justify-content-space-between is-align-content-center">
        <div className="mb-1">OpenAPI</div>
        {conditionalChecker('openapi')}
        {/* {newRequestsOpenAPI?.openapiMetadata?.info.openapi
          ? newRequestsOpenAPI.openapiMetadata.info.openapi
          : ''} */}
      </div>
      <hr />
    </div>
  );
}

export default OpenAPIMetaData;
