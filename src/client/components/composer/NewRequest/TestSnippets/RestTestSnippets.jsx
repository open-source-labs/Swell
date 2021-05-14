/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";

export default function RestTestSnippets(props) {
  const { setNewTestContent, setShowTests } = props;

  const snippets = {
    "Status code: Code is 200":
      "assert.strictEqual(response.status, 200, 'response is 200')",

    "Access the cookies from the response object":
      "assert.exists(response.cookies, 'cookies exists on response object')",
  };

  const handleClickOne = () => {
    setShowTests(true);
    setNewTestContent(snippets["Status code: Code is 200"]);
  };

  const handleClickTwo = () => {
    setShowTests(true);
    setNewTestContent(snippets["Access the cookies from the response object"]);
  };

  return (
    <div>
      <span onClick={handleClickOne}>Status code: Code is 200</span>;
      <br />
      <span onClick={handleClickTwo}>
        Access the cookies from the response object
      </span>
      ;
    </div>
  );
}
