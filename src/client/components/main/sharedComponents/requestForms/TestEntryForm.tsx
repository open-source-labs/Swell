import React, { useState } from 'react';
import { useAppSelector } from '~/toolkit/store';
import TextCodeArea from '../TextCodeArea';
import RestTestSnippets from '../stressTest/RestTestSnippets';
import WebsocketTestSnippets from '../stressTest/WebsocketTestSnippets';

interface Props {
  isWebSocket: boolean;
  testContent: string;
  newTestContentSet: (value: string) => void;
}

const TestEntryForm: React.FC<Props> = ({
  isWebSocket,
  testContent,
  newTestContentSet,
}) => {
  const isDark = useAppSelector((state) => state.ui.isDark);

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
