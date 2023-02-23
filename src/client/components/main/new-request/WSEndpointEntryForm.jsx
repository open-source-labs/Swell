import React from 'react';
import { useSelector } from 'react-redux';

const WSEndpointEntryForm = ({
  warningMessage,
  setWarningMessage,
  fieldsReplaced,
  newRequestFields,
}) => {
  const warningCheck = () => {
    if (warningMessage.uri) {
      const warningMessage = { ...warningMessage };
      delete warningMessage.uri;
      setWarningMessage({ ...warningMessage });
    }
  };

  const urlChangeHandler = (e) => {
    warningCheck();
    const url = e.target.value;
    fieldsReplaced({
      ...newRequestFields,
      wsUrl: url,
      url,
    });
  };

  const isDark = useSelector((store) => store.ui.isDark);

  return (
    <div
      className="is-flex is-justify-content-center"
      style={{ padding: '10px' }}
    >
      <div id="webSocketButton" className="no-border-please button is-ws">
        <span>WS</span>
      </div>
      <input
        className={`${
          isDark ? 'is-dark-300' : ''
        } ml-1 input input-is-medium is-info`}
        type="text"
        id="url-input"
        placeholder="Enter endpoint"
        value={newRequestFields.wsUrl}
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

export default WSEndpointEntryForm;
