import React, { useState } from "react";
import WWWForm from "./WWWForm.jsx";
import BodyTypeSelect from "./BodyTypeSelect.jsx";
import JSONTextArea from "./JSONTextArea.jsx";
import RawBodyTypeSelect from "./RawBodyTypeSelect.jsx"

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
    //all other cases..just plain text area

    return (
      <textarea
        value={newRequestBody.bodyContent}
        className="composer_textarea"
        type="text"
        placeholder="Body"
        rows={10}
        onChange={(e) => {
          setNewRequestBody({
            ...newRequestBody,
            bodyContent: e.target.value,
          });
        }}
      />
    );
  }

  

  return (
    <div>
      <div className='is-flex'>
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
      </div>
          
      { // conditionally render warning message
        warningMessage ? 
        <div>
          <div >{warningMessage.body || warningMessage.json}</div>
        </div>
        : null 
      }
      {bodyEntryArea()}
    </div>
  );
};

export default BodyEntryForm;
