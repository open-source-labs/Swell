/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";

export default function WebsocketTestSnippets(props) {
  const { setNewTestContent, setShowTests } = props;

  const snippets = {
    "Status code: Code is 200":
      "assert.strictEqual(response.status, 200, 'response is 200')",

    "Konrad is chilling in Staten" : "Nate's in Queens", 
    "EchoTest" : "some random test"
  };

  const handleClickOne = () => {
    setShowTests(true);
    setNewTestContent(snippets["Status code: Code is 200"]);
  };

  const handleClickTwo = () => {
    setShowTests(true);
    setNewTestContent(snippets["Konrad is chilling in Staten"]);
  };

  const handleClickThree = () => {
    setShowTests(true);
    setNewTestContent("Echo Test");
  };

  

  return (
    <div>
      <span onClick={handleClickOne}>Status code: Code is 200</span>;
      <br />
      <span onClick={handleClickTwo}>
        {snippets["Konrad is chilling in Staten"]}
      </span>
      <br />
      <span onClick={handleClickThree}>
        Echo Test
      </span>
      
    </div>
  );
}
