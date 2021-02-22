/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";

export default function RestTestSnippets(props) {
  const { setNewTestContent, setShowTests } = props;

  const snippets = {
    "Status code: Code is 200":
      "assert.strictEqual(response.status, 200, 'response is 200')",
  };

  const handleClick = () => {
    setShowTests(true);
    setNewTestContent(snippets["Status code: Code is 200"]);
  };

  return <span onClick={handleClick}>Status code: Code is 200</span>;
}
