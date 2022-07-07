import React, { useState, useEffect, useRef } from 'react';
import CodeMirror, { EditorState } from '@uiw/react-codemirror';
import { useSelector } from 'react-redux';
// import 'codemirror/addon/edit/matchbrackets';
// import 'codemirror/addon/edit/closebrackets';
// import 'codemirror/theme/twilight.css';
// import 'codemirror/lib/codemirror.css';
// import 'codemirror/addon/display/autorefresh';
// import 'codemirror/addon/display/placeholder';
// import 'codemirror/mode/javascript/javascript';
import { EditorView } from '@codemirror/view';
export { EditorState } from '@codemirror/state';

import { json } from '@codemirror/lang-json';
import { EditRoadOutlined, ModeEditRounded } from '@mui/icons-material';
import { bracketMatching, matchBrackets } from '@codemirror/language';

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
          extensions={[json(), EditorView.lineWrapping]}
          placeholder="Variables must be JSON format"
          theme="dark"
          height="100%"
          width="100%"
          // onBeforeChange={(editor, data, value) => {
          //   setValue(value);
          // }}
          onChange={(value, viewUpdate) => {
            setValue(value); // maybe? the onBeforeChange hook was removed, but all it did was fire before "onChange"
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
