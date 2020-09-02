import React, { useState, useEffect, useRef } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/addon/edit/matchbrackets";
import "codemirror/addon/edit/closebrackets";
import "codemirror/theme/twilight.css";
import "codemirror/lib/codemirror.css";
import "codemirror/addon/display/autorefresh"
import "codemirror/addon/display/placeholder"
import "codemirror/mode/javascript/javascript"

const GraphQLVariableEntryForm = (props) => {
  const {
    newRequestBody: { bodyVariables },
    newRequestBody: { bodyIsNew },
    newRequestBody,
    setNewRequestBody,
  } = props;

  const [show, setShow] = useState(false);
  const [cmValue, setValue] = useState(bodyVariables);

  // ref to get the codemirror instance
  const cmVariables = useRef(null);

  // set a new value for codemirror only if loading from history or changing gQL type
  useEffect(() => {
    if (!bodyIsNew) setValue(bodyVariables);
  }, [bodyVariables]);

  const bodyContainerClass = show
    ? "composer_bodyform_container-open"
    : "composer_bodyform_container-closed";

  return (
    <div>
      <label
      className='composer_subtitle' >
        <div className="label-text" id="variable-click">Variables</div>
        <div className="toggle">
          <input type="checkbox" name="check" className="toggle-state" onClick={() => {
          setShow(!show);}}/>
          <div className="indicator" />
        </div>
      </label>
      <div className={bodyContainerClass} id="graphql-variable" style={{ marginBottom: '10px' }}>
        <CodeMirror
        ref={cmVariables}
          value={cmValue}
          options={{
            mode: { name: "javascript", json: true },
            theme: 'twilight',
            scrollbarStyle: 'native',
            lineNumbers: false,
            matchBrackets: true,
            autoCloseBrackets: true,
            indentUnit: 2,
            tabSize: 2,
            autoRefresh: true,
            placeholder: 'Variables must be JSON format'
          }}
          editorDidMount={editor => { editor.setSize('100%', 100) }}
          onBeforeChange={(editor, data, value) => {
            setValue(value);
          }}
          onChange={(editor, data, value) => {
            setNewRequestBody({
              ...newRequestBody,
              bodyVariables: value,
              bodyIsNew: true,
            });
          }}
        />
      </div>
    </div>
  );
};

export default GraphQLVariableEntryForm;
