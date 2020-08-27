import React, { useState } from "react";
import WWWForm from "./WWWForm.jsx";
import BodyTypeSelect from "./BodyTypeSelect.jsx";
import JSONTextArea from "./JSONTextArea.jsx";

const BodyEntryForm = (props) => {
  const [show, toggleShow] = useState(true);
  const {
    newRequestBody,
    setNewRequestBody,
    stylesObj,
    newRequestHeaders,
    setNewRequestHeaders,
  } = props;

  const rawTypeStyles = {
    display: newRequestBody.bodyType === "raw" ? "block" : "none",
  };

  const bodyEntryArea = (() => {
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
  })();

  const bodyContainerClass = show
    ? "composer_bodyform_container-open"
    : "composer_bodyform_container-closed";

  return (
    <div style={stylesObj}>
      <label
      className='composer_subtitle' >
        <div className="label-text" >Body</div>
          <div className="toggle" >
            <input type="checkbox" name="check" className="toggle-state" onClick={() => toggleShow((show) => !show)}/>
            <div className="indicator_body" />
          </div>
      </label>

      <div className={bodyContainerClass}>
        <BodyTypeSelect
          setNewRequestBody={setNewRequestBody}
          newRequestBody={newRequestBody}
          setNewRequestHeaders={setNewRequestHeaders}
          newRequestHeaders={newRequestHeaders}
        />

        <div className="composer_rawtype_textarea_container">
          <select
            style={rawTypeStyles}
            className="composer_rawtype_select"
            onChange={(e) =>
              setNewRequestBody({
                ...newRequestBody,
                rawType: e.target.value,
              })
            }
            value={newRequestBody.rawType}
          >
            Raw Type:
            <option value="text/plain">Text (text/plain)</option>
            <option value="application/json">JSON (application/json)</option>
            <option value="application/javascript">
              Javascript (application/javascript)
            </option>
            <option value="application/xml">XML (application/xml)</option>
            <option value="text/xml">XML (text/xml)</option>
            <option value="text/html">HTML (text/html)</option>
          </select>
          {bodyEntryArea}
        </div>
      </div>
    </div>
  );
};

export default BodyEntryForm;
