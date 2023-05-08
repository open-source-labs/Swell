import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../toolkit-refactor/store';
import { OpenAPIRequest } from '../../../../types';

interface OpenAPIEntryFormProps {
  warningMessage: {
    uri?: string;
  };
  newRequestsOpenAPI: OpenAPIRequest
}



const OpenAPIEntryForm: React.FC<OpenAPIEntryFormProps> = ({
  warningMessage,
  newRequestsOpenAPI,
}) => {
  const primaryServer = newRequestsOpenAPI?.openapiMetadata?.serverUrls[0];

  const openAPILabel = 'OpenAPI';

  const isDark = useSelector((state: RootState) => state.ui.isDark);

  return (
    <div className='ml-2 mr-2 is-flex is-justify-content-center'
      style={{padding: '10px'}}>
      <button className="no-border-please button is-openapi">
        <span>{openAPILabel}</span>
      </button>
      <input
        className={`${isDark ? 'is-dark-300' : ''} ml-1 input input-is-medium is-info`}
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
