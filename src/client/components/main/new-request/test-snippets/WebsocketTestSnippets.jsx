/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';

export default function WebsocketTestSnippets(props) {
  const { setNewTestContent, setShowTests } = props;

  const snippets = {
    'Status code: connection is open':
      "assert.strictEqual(response.connection, 'open', 'response is open')",
  };

  const handleClickOne = () => {
    setShowTests(true);
    setNewTestContent(snippets['Status code: connection is open']);
  };

  return (
    <div>
      <span onClick={handleClickOne}>Status code: connection is open</span>;
    </div>
  );
}
