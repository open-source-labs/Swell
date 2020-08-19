import React, { useState, useEffect, useRef } from "react";
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
import "codemirror/addon/display/autorefresh"

import dropDownArrow from "../../../../assets/icons/arrow_drop_down_white_192x192.png";

const GraphQLVariableEntryForm = (props) => {
  const {
    newRequestBody: { bodyVariables },
    newRequestBody: { bodyIsNew },
    newRequestBody,
    setNewRequestBody,
    stylesObj,
  } = props;

  const [show, setShow] = useState(false);
  const [cmValue, setValue] = useState(bodyVariables);

  // ref to get the codemirror instance
  const cmVariables = useRef(null);

  // set a new value for codemirror only if loading from history or changing gQL type
  useEffect(() => {
    if (!bodyIsNew) setValue(bodyVariables);
  }, [bodyVariables])

  const arrowClass = show
    ? "composer_subtitle_arrow-open"
    : "composer_subtitle_arrow-closed";
  const bodyContainerClass = show
    ? "composer_bodyform_container-open"
    : "composer_bodyform_container-closed";

  return (
    <div>
      <div
        className="composer_subtitle"
        onClick={() => {
          setShow(!show);
          // focus the editor after showing
          cmVariables.current.editor.focus();
        }}
        style={stylesObj}
      >
        <img className={arrowClass} src={dropDownArrow} alt="" />
        Variables
      </div>
      <div className={bodyContainerClass} style={{ marginBottom: '10px' }}>
        <CodeMirror
        ref={cmVariables}
          value={cmValue}
          options={{
            mode: 'graphql',
            theme: 'twilight',
            scrollbarStyle: 'native',
            lineNumbers: false,
            matchBrackets: true,
            autoCloseBrackets: true,
            indentUnit: 2,
            tabSize: 2,
            autoRefresh: true,
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
