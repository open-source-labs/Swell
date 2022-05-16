/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import WWWForm from './WWWForm.jsx';
import BodyTypeSelect from './BodyTypeSelect.jsx';
import JSONTextArea from './JSONTextArea.jsx';
import RawBodyTypeSelect from './RawBodyTypeSelect.jsx';
import JSONPrettify from './JSONPrettify.jsx';
import TextCodeArea from './TextCodeArea.jsx';
import dropDownArrow from '../../../../assets/icons/caret-down-tests.svg';
import dropDownArrowUp from '../../../../assets/icons/caret-up-tests.svg';
// import { isAbsolute, relative } from 'path';
import RestTestSnippetsContainer from './TestSnippets/RestTestSnippetsContainer';

const TestEntryForm = (props) => {
  const { testContent, setNewTestContent } = props;
  const isDark = useSelector((store) => store.ui.isDark);

  const [showTests, setShowTests] = useState(false);
  const handleShowTests = () => setShowTests(!showTests);

  return (
    <div className="mt-4 mb-4">
      <RestTestSnippetsContainer
        testContent={testContent}
        setNewTestContent={setNewTestContent}
        setShowTests={setShowTests}
      />
      <div
        className={`${isDark ? 'is-dark-200' : ''} is-rest-invert show-hide-tests cards-dropdown minimize-card is-flex is-align-items-center is-justify-content-center`}
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
              setNewTestContent(value);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TestEntryForm;
