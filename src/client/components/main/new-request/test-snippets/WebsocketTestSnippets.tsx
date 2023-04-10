/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import TestSnippetsButton from './TestSnippetsButton';
import { AppDispatch } from '../../../../toolkit-refactor/store';

export default function WebsocketTestSnippets({
  setShowTests,
  newTestContentSet,
}: {
  setShowTests: (arg: boolean) => AppDispatch;
  newTestContentSet: (arg: string) => AppDispatch;
}) {
  const [showSnippets, setShowSnippets] = useState(false);

  const handleShowSnippets = (): void => {
    setShowSnippets(!showSnippets);
  };

  const snippets: { [key: string]: string } = {
    'Assert connection is open':
      "assert.strictEqual(response.connection, 'open', 'response is open')",
  };

  const handleClick = (event: React.MouseEvent) => {
    setShowTests(true);
    newTestContentSet(snippets[`${(event.target as HTMLElement).innerHTML}`]);
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
