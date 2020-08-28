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

import dropDownArrow from "../../../../assets/icons/arrow_drop_down_white_192x192.png";

const GraphQLBodyEntryForm = (props) => {
  const {
    newRequestBody,
    newRequestBody: { bodyContent },
    newRequestBody: { bodyIsNew },
    setNewRequestBody,
    warningMessage,
    stylesObj,
    introspectionData,
  } = props;

  const [show, setShow] = useState(true);
  const [cmValue, setValue] = useState(bodyContent);

  // set a new value for codemirror only if loading from history or changing query type
  useEffect(() => {
    if (!bodyIsNew) setValue(bodyContent)
  }, [bodyContent])

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
        }}
        style={stylesObj}
      >
        <img className={arrowClass} src={dropDownArrow} alt="" />
        Body
      </div>
      { // conditionally render warning message
        warningMessage ? 
          <div style={{ color: "red", marginBottom: "10px" }}>
            {warningMessage.body}
          </div>
        : null 
      }
      <div className={bodyContainerClass} style={{ marginBottom: "10px" }}>
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
