import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../toolkit-refactor/store';
import { $TSFixMe } from '../../../../types';

interface Props {
  warningMessage: {
    uri?: string;
  };
  newRequestsOpenAPI: $TSFixMe
  primaryServer: string
}

// This component is working as intended, thouhg needs to have the TS tightened up
const OpenAPIEntryForm: React.FC<Props> = ({
  warningMessage,
  newRequestsOpenAPI,
  primaryServer
}) => {
  // This loads the input field at the top of the page
  const isDark = useSelector((state: RootState) => state.ui.isDark);

  return (
    <div className='ml-2 mr-2 is-flex is-justify-content-center'
      style={{padding: '10px'}}>
      <button className="no-border-please button is-openapi">
        <span>OpenAPI</span>
      </button>
      <input
        className={`${isDark ? 'is-dark-300' : ''} ml-1 input input-is-medium is-info`}
        type="text"
        placeholder="primary server loads here..."
        value={primaryServer}
        onChange={() => {return 'testTest'}}
      />
      {warningMessage.uri && (
        <div className="warningMessage">{warningMessage.uri}</div>
      )}
    </div>
  );
};

export default OpenAPIEntryForm;
