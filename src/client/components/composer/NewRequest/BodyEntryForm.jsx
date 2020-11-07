import React, { useState } from "react";
import WWWForm from "./WWWForm.jsx";
import BodyTypeSelect from "./BodyTypeSelect.jsx";
import JSONTextArea from "./JSONTextArea.jsx";
import RawBodyTypeSelect from "./RawBodyTypeSelect.jsx"
import JSONPrettify from "./JSONPrettify.jsx"
import TextCodeAreaEditable from "./TextCodeAreaEditable.jsx"

const BodyEntryForm = (props) => {
  // const [show, toggleShow] = useState(true);
  const {
    newRequestBody,
    setNewRequestBody,
    newRequestHeaders,
    setNewRequestHeaders,
    warningMessage,
  } = props;


  const bodyEntryArea = () => {
    //BodyType of none : display nothing
    if (newRequestBody.bodyType === "none") {
      return;
    }
    //BodyType of XWWW... : display WWWForm entry
    if (newRequestBody.bodyType === "x-www-form-urlencoded") {
      return (
        <WWWForm
          setNewRequestBody={setNewRequestBody}
          newRequestBody={newRequestBody}
        />
      );
    }
    //RawType of application/json : Text area box with error checking
    if (newRequestBody.rawType === "application/json") {
      return (
        <JSONTextArea
          setNewRequestBody={setNewRequestBody}
          newRequestBody={newRequestBody}
        />
      );
    }

    return (
      <TextCodeAreaEditable 
        mode={newRequestBody.rawType}
        value={newRequestBody.bodyContent}
        onChange={(editor, data, value) => {
          setNewRequestBody({
            ...newRequestBody,
            bodyContent: value,
          });
        }}
      />
    );
  }

  

  return (
    <div className = "mt-1" >
      <div className="composer-section-title">Body</div>
      <div className='is-flex is-align-items-center is-justify-content-space-between'>
        <span className="is-flex is-align-items-center">
          <BodyTypeSelect
            setNewRequestBody={setNewRequestBody}
            newRequestBody={newRequestBody}
            setNewRequestHeaders={setNewRequestHeaders}
            newRequestHeaders={newRequestHeaders}
          />
              
          {/* DROP DOWN MENU FOR SELECTING RAW TEXT TYPE */}
          { newRequestBody.bodyType === "raw" &&
            <RawBodyTypeSelect
              setNewRequestBody={setNewRequestBody}
              newRequestBody={newRequestBody}
              setNewRequestHeaders={setNewRequestHeaders}
              newRequestHeaders={newRequestHeaders}
            /> 
          }
        </span>
        { newRequestBody.bodyType === "raw" &&
          newRequestBody.rawType === 'application/json' &&
          <JSONPrettify
          newRequestBody={newRequestBody}
          setNewRequestBody={setNewRequestBody}
          />
        }
      </div>
          
      { // conditionally render warning message
        warningMessage ? 
        <div>
          <div >{warningMessage.body || warningMessage.json}</div>
        </div>
        : null 
      }
      <div className="mt-2"  id = "body-entry-select">{bodyEntryArea()}</div>
      
    </div>
  );
};

export default BodyEntryForm;
