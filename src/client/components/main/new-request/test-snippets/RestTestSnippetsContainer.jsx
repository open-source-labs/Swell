/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import dropDownArrow from '../../../../../assets/icons/caret-down-tests.svg';

import dropDownArrowUp from '../../../../../assets/icons/caret-up-tests.svg';

import RestTestSnippets from './RestTestSnippets';

export default function RestTestSnippetsContainer(props) {
  const { setShowTests, testContent, newTestContentSet } = props;
  const [showSnippets, setShowSnippets] = useState(false);

  const isDark = useSelector((store) => store.ui.isDark);

  const handleShowSnippets = () => {
    setShowSnippets(!showSnippets);
  };
  return (
    <div>
      <div
        className={`${
          isDark ? 'is-dark-200' : ''
        } is-rest-invert show-hide-tests cards-dropdown minimize-card is-flex is-align-items-center is-justify-content-center`}
        onClick={handleShowSnippets}
      >
        {showSnippets === true && (
          <>
            <span>Test Snippets</span>
          </>
        )}

        {showSnippets === false && (
          <>
            <span>Test Snippets</span>
          </>
        )}
      </div>

      {showSnippets === true && (
        <div id="test-snippets">
          <RestTestSnippets
            testContent={testContent}
            newTestContentSet={newTestContentSet}
            setShowTests={setShowTests}
          />
        </div>
      )}
    </div>
  );
}
