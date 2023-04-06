/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import TestSnippetsButton from './TestSnippetsButton';

export default function WebsocketTestSnippets(props) {
  const { setShowTests, newTestContentSet } = props;
  const [showSnippets, setShowSnippets] = useState(false);

  const handleShowSnippets = () => {
    setShowSnippets(!showSnippets);
  };

  const snippets = {
    'Assert connection is open':
      "assert.strictEqual(response.connection, 'open', 'response is open')",
  };

  const handleClick = (event) => {
    setShowTests(true);
    newTestContentSet(snippets[`${event.target.innerHTML}`]);
  };

  return (
    <div>
      <TestSnippetsButton
        showSnippets={showSnippets}
        handleShowSnippets={handleShowSnippets}
      />

      {showSnippets === true && (
        <div id="test-snippets" className="assertion-test-snippets">
          <header>
            Click on the following example to create assertion test below!
          </header>
          <span onClick={handleClick}>Assert connection is open</span>
        </div>
      )}
    </div>
  );
}
