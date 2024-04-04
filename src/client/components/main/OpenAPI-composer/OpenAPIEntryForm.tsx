import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../toolkit-refactor/hooks';
import { $TSFixMe } from '../../../../types';

interface Props {
  warningMessage: {
    uri?: string;
  };
  newRequestsOpenAPI: $TSFixMe
  primaryServer: string
}

// This component is working as intended, though needs to have the TS tightened up
const OpenAPIEntryForm: React.FC<Props> = ({
  warningMessage,
  newRequestsOpenAPI,
  primaryServer
}) => {
  // This loads the input field at the top of the page
  const isDark = useAppSelector((store: { ui: { isDark: boolean } }) => store.ui.isDark);

  return (
    <div className='ml-2 mr-2 is-flex is-justify-content-center'
      style={{padding: '10px'}}>
      <button className="no-border-please button is-openapi">
        <span>OpenAPI</span>
      </button>
      <input
        className={`${
          isDark ? 'dark-address-input' : ''
        } ml-1 input input-is-medium is-info`}
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
