import React, { useState } from "react";
import WWWForm from "./WWWForm.jsx";
import BodyTypeSelect from "./BodyTypeSelect.jsx";
import JSONTextArea from "./JSONTextArea.jsx";
import RawBodyTypeSelect from "./RawBodyTypeSelect.jsx"
import JSONPrettify from "./JSONPrettify.jsx"
import TextCodeAreaEditable from "./TextCodeAreaEditable.jsx"
import dropDownArrow from "../../../../assets/icons/caret-down-tests.svg";
import dropDownArrowUp from "../../../../assets/icons/caret-up-tests.svg";
import { isAbsolute, relative } from "path";

const TestEntryForm = (props) => {
  const {
    testContent,
    setNewTestContent
  } = props;

  const [showTests, setShowTests] = useState(false);
  const handleShowTests = () => setShowTests(!showTests);

  return (
    <div className='mt-4 mb-4'>
      <div
        className="is-rest-invert show-hide-tests cards-dropdown minimize-card is-flex is-align-items-center is-justify-content-center"
        onClick={() => {
          handleShowTests();
        }}
      >
      {showTests === true &&
        <>
          <span>Hide Tests</span>
          <span className="icon is-medium is-align-self-center show-hide-tests-icon">
            <img 
              alt=''
              src={dropDownArrowUp} 
              className="is-awesome-icon" 
              aria-hidden="false" 
            />
          </span>
        </>
      }
      {showTests === false &&
        <>
          <span>View Tests</span>
          <span className="icon is-medium is-align-self-center show-hide-tests-icon">
            <img 
              alt=''
              src={dropDownArrow}
              className="is-awesome-icon" 
              aria-hidden="false" 
            />
          </span>
        </>
      }


      </div>
    {showTests === true &&
      <div id="test-script-entry">
        <TextCodeAreaEditable
          mode="javascript"
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
