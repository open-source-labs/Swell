/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import TestSnippetsButton from './TestSnippetsButton';

export default function RestTestSnippets(props) {
  const { setShowTests, newTestContentSet } = props;
  const [showSnippets, setShowSnippets] = useState(false);

  const handleShowSnippets = () => {
    setShowSnippets(!showSnippets);
  };

  const snippets = {
    'Assert response status code is 200':
      "assert.strictEqual(response.status, 200, 'response is 200')",

    'Assert cookies are accessible from the response object':
      "assert.exists(response.cookies, 'cookies exists on response object')",
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
          <span onClick={handleClick}>Assert response status code is 200</span>
          <span onClick={handleClick}>
            Assert cookies are accessible from the response object
          </span>
        </div>
      )}
    </div>
  );
}
