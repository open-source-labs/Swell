
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../toolkit-refactor/hooks';

interface Props {
  warningMessage: Record<string, string>;
  setWarningMessage: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  fieldsReplaced: (newFields: Record<string, string>) => void;
  newRequestFields: Record<string, string>;
}

const WSEndpointEntryForm: React.FC<Props> = ({
  warningMessage,
  setWarningMessage,
  fieldsReplaced,
  newRequestFields,
}) => {
  const warningCheck = () => {
    if (warningMessage.uri) {
      const warningMessageCopy = { ...warningMessage };
      delete warningMessageCopy.uri;
      setWarningMessage({ ...warningMessageCopy });
    }
  };

  const urlChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    warningCheck();
    const url = e.target.value;
    fieldsReplaced({
      ...newRequestFields,
      wsUrl: url,
      url,
    });
  };

  const isDark = useAppSelector((store: any) => store.ui.isDark);

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
          isDark ? 'dark-address-input' : ''
        } ml-1 input input-is-medium is-info`}
        type="text"
        id="url-input"
        placeholder="Enter endpoint"
        value={newRequestFields.wsUrl}
        onChange={urlChangeHandler}
      />
      {warningMessage.uri && (
        <div className="warningMessage">{warningMessage.uri}</div>
      )}
    </div>
  );
};

export default WSEndpointEntryForm;
