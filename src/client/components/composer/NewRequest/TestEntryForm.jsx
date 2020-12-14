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
    <div className='mt-3'>
      <div
        className="is-rest-invert cards-dropdown minimize-card is-flex is-align-items-center is-justify-content-center"
        style={{height: '3rem', fontSize: '18px'}}
        onClick={() => {
          handleShowTests();
        }}
      >
      {showTests === true &&
        <>
          <span>Hide Tests</span>
          <span className="icon is-medium is-align-self-center">
            <img 
              alt=''
              src={dropDownArrowUp} 
              style={{position: relative, left: '15rem'}}
              className="is-awesome-icon" 
              aria-hidden="false" 
            />
          </span>
        </>
      }
      {showTests === false &&
        <>
          <span>View Tests</span>
          <span className="icon is-medium is-align-self-center">
            <img 
              alt=''
              src={dropDownArrow} 
              style={{position: relative, left: '15rem'}}
              className="is-awesome-icon" 
              aria-hidden="false" 
            />
          </span>
        </>
      }


      </div>
    {showTests === true &&
      <div id="body-entry-select">
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
