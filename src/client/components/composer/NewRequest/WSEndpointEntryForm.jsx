import React from 'react';

const WSEndpointEntryForm = ({
  warningMessage,
  setComposerWarningMessage,
  setNewRequestFields,
  newRequestFields,
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
      wsUrl: url,
      url,
    });
  };

  return (
    <div className="is-flex is-justify-content-center">
      <div id="webSocketButton" className="button is-ws">
        <span>WS</span>
      </div>
      <input
        className="ml-1 input input-is-medium is-info"
        type="text"
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
