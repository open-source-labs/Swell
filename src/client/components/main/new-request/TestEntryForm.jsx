/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import TextCodeArea from './TextCodeArea';
import RestTestSnippets from './test-snippets/RestTestSnippets';
import WebsocketTestSnippets from './test-snippets/WebsocketTestSnippets';

const TestEntryForm = (props) => {
  const { isWebSocket, testContent, newTestContentSet } = props;
  const isDark = useSelector((store) => store.ui.isDark);

  const [showTests, setShowTests] = useState(false);
  const handleShowTests = () => setShowTests(!showTests);

  return (
    <div className="mt-4 mb-4">
      {isWebSocket ? (
        <WebsocketTestSnippets
          testContent={testContent}
          newTestContentSet={newTestContentSet}
          setShowTests={setShowTests}
        />
      ) : (
        <RestTestSnippets
          testContent={testContent}
          newTestContentSet={newTestContentSet}
          setShowTests={setShowTests}
        />
      )}
      <div
        className={`${
          isDark ? 'is-dark-200' : ''
        } is-rest-invert show-hide-tests cards-dropdown minimize-card is-flex is-align-items-center is-justify-content-center`}
        onClick={handleShowTests}
      >
        {showTests === true && (
          <>
            <span>Hide Assertion Tests</span>
          </>
        )}
        {showTests === false && (
          <>
            <span>View Assertion Tests</span>
          </>
        )}
      </div>
      {showTests === true && (
        <div id="test-script-entry">
          <TextCodeArea
            mode="javascript"
            value={testContent}
            onChange={(value) => {
              newTestContentSet(value);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TestEntryForm;
