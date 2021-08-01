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

const WebRTCBodyEntryForm = (props) => {
  const {
    newRequestBody,
    newRequestBody: { bodyContent },
    newRequestBody: { bodyIsNew },
    setNewRequestBody,
    warningMessage,
    introspectionData,
  } = props;

  const [cmValue, setValue] = useState(bodyContent);

  // set a new value for codemirror only if loading from history or changing query type
  useEffect(() => {
    if (!bodyIsNew) setValue(bodyContent);
  }, [bodyContent]);

  return (
    <div className="mt-3">
      {
        // conditionally render warning message
        warningMessage ? <div>{warningMessage.body}</div> : null
      }
      <div className="composer-section-title">Body</div>
      <div id="gql-body-entry" className="is-neutral-200-box p-3">
        <CodeMirror
          value={cmValue}
          options={{
            mode: "graphql",
            theme: "neo sidebar",
            scrollbarStyle: "native",
            lineNumbers: false,
            lint: true,
            hintOptions: true,
            matchBrackets: true,
            autoCloseBrackets: true,
            indentUnit: 2,
            tabSize: 2,
          }}
          editorDidMount={(editor) => {
            editor.setSize("100%", 150);
          }}
          onBeforeChange={(editor, data, value) => {
            const optionObj = {
              schema: introspectionData.clientSchema,
              completeSingle: false,
            };
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

export default WebRTCBodyEntryForm;
