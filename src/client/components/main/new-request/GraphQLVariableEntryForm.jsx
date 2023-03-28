import React, { useState, useEffect, useRef } from 'react';
import CodeMirror, { EditorState } from '@uiw/react-codemirror';
import { useSelector } from 'react-redux';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { EditorView } from '@codemirror/view';
export { EditorState } from '@codemirror/state';
import { json } from '@codemirror/lang-json';

const GraphQLVariableEntryForm = (props) => {
  const {
    newRequestBody: { bodyVariables },
    newRequestBody: { bodyIsNew },
    newRequestBody,
    newRequestBodySet,
  } = props;

  const [cmValue, setValue] = useState(bodyVariables);

  // ref to get the codemirror instance
  const cmVariables = useRef(null);

  // set a new value for codemirror only if loading from history or changing gQL type
  useEffect(() => {
    if (!bodyIsNew) setValue(bodyVariables);
  }, [bodyVariables]);

  const isDark = useSelector((store) => store.ui.isDark);

  return (
    <div>
      <div className="composer-section-title">Variables</div>
      <div
        className={`${isDark ? 'is-dark-400' : ''} is-neutral-200-box p-3`}
        id="gql-var-entry"
      >
        <CodeMirror
          ref={cmVariables}
          value={cmValue}
          theme={vscodeDark}
          extensions={[json(), EditorView.lineWrapping]}
          placeholder="Variables must be JSON format"
          height="100px"
          onChange={(value) => {
            setValue(value);
            newRequestBodySet({
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
