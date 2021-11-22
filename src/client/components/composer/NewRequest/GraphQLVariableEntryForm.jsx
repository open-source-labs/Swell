import React, { useState, useEffect, useRef } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { useSelector } from 'react-redux';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/theme/twilight.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/display/autorefresh';
import 'codemirror/addon/display/placeholder';
import 'codemirror/mode/javascript/javascript';

const GraphQLVariableEntryForm = (props) => {
  const {
    newRequestBody: { bodyVariables },
    newRequestBody: { bodyIsNew },
    newRequestBody,
    setNewRequestBody,
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
      <div className={`${isDark ? 'is-dark-400' : ''} is-neutral-200-box p-3`} id="gql-var-entry">
        <CodeMirror
          ref={cmVariables}
          value={cmValue}
          options={{
            mode: { name: 'javascript', json: true },
            theme: 'neo sidebar',
            scrollbarStyle: 'native',
            lineNumbers: false,
            matchBrackets: true,
            autoCloseBrackets: true,
            indentUnit: 2,
            tabSize: 2,
            autoRefresh: true,
            placeholder: 'Variables must be JSON format',
          }}
          editorDidMount={(editor) => {
            editor.setSize('100%', 100);
          }}
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
