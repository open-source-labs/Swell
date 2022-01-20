/* eslint-disable default-case */
import React from 'react';
import { useSelector } from 'react-redux';

const GRPCTypeAndEndpointEntryForm = ({
  warningMessage,
  setComposerWarningMessage,
  setNewRequestFields,
  newRequestFields,
  newRequestStreams,
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
      grpcUrl: url,
      url,
    });
  };

  // TO DO
  // change this to be initial state instead
  const grpcStreamLabel = newRequestStreams.selectedStreamingType || 'STREAM';

  const isDark = useSelector((state) => state.ui.isDark);

  return (
    <div className={`ml-2 mr-2 is-flex is-justify-content-center `}
    style={{padding: '10px'}}>
      {/* button id is now stream for vanilla JS selector, this should change */}
      <button id="stream" className="no-border-please button is-grpc">
        <span>{grpcStreamLabel}</span>
      </button>
      <input
        className={`${isDark ? 'is-dark-300' : '' } ml-1 input input-is-medium is-info`}
        type="text"
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
