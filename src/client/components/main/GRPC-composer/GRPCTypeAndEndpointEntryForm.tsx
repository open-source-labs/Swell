/* eslint-disable default-case */
import React from 'react';
import { useAppSelector } from '../../../rtk/store';
import {
  type $TSFixMe,
  type NewRequestFields,
  type NewRequestStreams,
} from '~/types';

interface Props {
  warningMessage: $TSFixMe; // This is a
  setWarningMessage: (warningMessage: $TSFixMe) => void;
  fieldsReplaced: (fields: NewRequestFields) => void;
  newRequestFields: NewRequestFields;
  newRequestStreams: NewRequestStreams;
}

const GRPCTypeAndEndpointEntryForm: React.FC<Props> = (props) => {
  const {
    warningMessage,
    setWarningMessage,
    fieldsReplaced,
    newRequestFields,
    newRequestStreams,
  } = props;

  const warningCheck = (): void => {
    if (warningMessage.uri) {
      const newWarningMessage = { ...warningMessage };
      delete newWarningMessage.uri;
      setWarningMessage({ ...newWarningMessage });
    }
  };

  const urlChangeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    warningCheck();
    const url = e.target.value;
    fieldsReplaced({
      ...newRequestFields,
      grpcUrl: url,
      url,
    });
  };

  // TO DO
  // change this to be initial state instead
  const grpcStreamLabel = newRequestStreams.selectedStreamingType || 'STREAM';

  const isDark = useAppSelector((state) => state.ui.isDark);

  return (
    <div
      className={`is-flex is-justify-content-center `}
      style={{ padding: '10px' }}
    >
      {/* button id is now stream for vanilla JS selector, this should change */}
      <button id="stream" className="no-border-please button is-grpc">
        <span>{grpcStreamLabel}</span>
      </button>
      <input
        className={`${
          isDark ? 'is-dark-300' : ''
        } ml-1 input input-is-medium is-info`}
        type="text"
        id="url-input"
        placeholder="Enter endpoint"
        value={newRequestFields.grpcUrl}
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

export default GRPCTypeAndEndpointEntryForm;
