/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import TextCodeArea from './TextCodeArea.tsx';
import WebsocketTestSnippetsContainer from './test-snippets/WebsocketTestSnippetsContainer';

const WSTestEntryForm = (props) => {
  const { testContent, newTestContentSet } = props;

  const [showTests, setShowTests] = useState(false);
  const handleShowTests = () => setShowTests(!showTests);
  const isDark = useSelector((store) => store.ui.isDark);

  return (
    <div className="mt-4 mb-4">
      <WebsocketTestSnippetsContainer
        testContent={testContent}
        newTestContentSet={newTestContentSet}
        setShowTests={setShowTests}
      />
      <div
        className={`${
          isDark ? 'is-dark-200' : ''
        } is-rest-invert show-hide-tests cards-dropdown minimize-card is-flex is-align-items-center is-justify-content-center`}
        onClick={handleShowTests}
      >
        {showTests === true && (
          <>
            <span>Hide Tests</span>
          </>
        )}
        {showTests === false && (
          <>
            <span>View Tests</span>
          </>
        )}
      </div>
      {showTests === true && (
        <div id="test-script-entry">
          <TextCodeArea
            mode="javascript"
            value={testContent}
            onChange={(value, viewUpdate) => {
              newTestContentSet(value);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default WSTestEntryForm;
