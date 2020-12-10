import React, { useState } from "react";
import WWWForm from "./WWWForm.jsx";
import BodyTypeSelect from "./BodyTypeSelect.jsx";
import JSONTextArea from "./JSONTextArea.jsx";
import RawBodyTypeSelect from "./RawBodyTypeSelect.jsx"
import JSONPrettify from "./JSONPrettify.jsx"
import TextCodeAreaEditable from "./TextCodeAreaEditable.jsx"

const TestEntryForm = (props) => {
  const {
    testContent,
    setNewTestContent
  } = props;

  return (
    <div className="mt-2" id="body-entry-select">
      <TextCodeAreaEditable
        mode={"javascript"}
        value={testContent}
        onChange={(editor, data, value) => {
          setNewTestContent(value);
        }}
      />
    </div>
  );
};

export default TestEntryForm;
