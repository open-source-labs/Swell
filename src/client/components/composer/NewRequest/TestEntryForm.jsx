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
  const [showDetails, setShowDetails] = useState(false);

  const handleShowDetails = () => setShowDetails(!showDetails);

  return (
    <div>
          <div
      className="is-neutral-300 is-size-7 cards-dropdown minimize-card pl-3 is-flex is-align-items-center is-justify-content-space-between"
      onClick={() => {
        handleShowDetails();
      }}
    >
    {showDetails === true && "Hide Tests"}
    {showDetails === false && "Enter Tests"}
    </div>



    {showDetails === true &&
          <div className="mt-2" id="body-entry-select">
      <TextCodeAreaEditable
        mode={"javascript"}
        value={testContent}
        onChange={(editor, data, value) => {
          setNewTestContent(value);
        }}
      />
    </div>
    }

    </div>







  );
};

export default TestEntryForm;
