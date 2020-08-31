import React, { useState, useEffect } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/addon/edit/matchbrackets";
import "codemirror/addon/edit/closebrackets";
import "codemirror/theme/twilight.css";
import "codemirror/lib/codemirror.css";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/show-hint.css";
import "codemirror-graphql/hint";
import "codemirror-graphql/lint";
import "codemirror-graphql/mode";
import "codemirror/addon/lint/lint.css";

const GraphQLBodyEntryForm = (props) => {
  const {
    newRequestBody,
    newRequestBody: { bodyContent },
    newRequestBody: { bodyIsNew },
    setNewRequestBody,
    warningMessage,
    introspectionData,
  } = props;

  const [show, setShow] = useState(true);
  const [cmValue, setValue] = useState(bodyContent);

  // set a new value for codemirror only if loading from history or changing query type
  useEffect(() => {
    if (!bodyIsNew) setValue(bodyContent)
  }, [bodyContent])

  const bodyContainerClass = show
    ? "composer_bodyform_container-open"
    : "composer_bodyform_container-closed";

  return (
    <div>
      <label
      className='composer_subtitle' >
        <div className="label-text" id="cookie-click">Body</div>
        <div className="toggle">
          <input type="checkbox" name="check" className="toggle-state" onClick={() => {
          setShow(!show);}}/>
          <div className="indicator_body" />
        </div>
      </label>
      { // conditionally render warning message
        warningMessage ? 
          <div style={{ color: "red", marginBottom: "10px" }}>
            {warningMessage.body}
          </div>
        : null 
      }
      <div className={bodyContainerClass} id="graphql-body">
        <CodeMirror
          value={cmValue}
          options={{
            mode: "graphql",
            theme: "twilight",
            scrollbarStyle: "native",
            lineNumbers: false,
            lint: true,
            hintOptions: true,
            matchBrackets: true,
            autoCloseBrackets: true,
            indentUnit: 2,
            tabSize: 2,
          }}
          editorDidMount={editor => { editor.setSize('100%', 150) }}
          onBeforeChange={(editor, data, value) => {
            const optionObj = {
              schema: introspectionData.clientSchema,
              completeSingle: false,
            }
            setValue(value);
            editor.setOption("lint", optionObj);
            editor.setOption("hintOptions", optionObj);
          }}
          onChange={(editor, data, value) => {
            editor.showHint();
            setNewRequestBody({
              ...newRequestBody,
              bodyContent: value,
              bodyIsNew: true,
            });
          }}
        />
      </div>
    </div>
  );
};

export default GraphQLBodyEntryForm;
