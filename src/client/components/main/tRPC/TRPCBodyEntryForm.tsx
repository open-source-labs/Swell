import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { useSelector } from 'react-redux';
import { RootState } from '../../../toolkit-refactor/store';

// import 'codemirror/addon/edit/matchbrackets';
// import 'codemirror/addon/edit/closebrackets';
// import 'codemirror/theme/twilight.css';
// import 'codemirror/lib/codemirror.css';
// import 'codemirror/addon/hint/show-hint';
// import 'codemirror/addon/hint/show-hint.css';
// import 'codemirror-graphql/hint';
// import 'codemirror-graphql/lint';
// import 'codemirror-graphql/mode';
// import 'codemirror/addon/lint/lint.css';

const TRPCBodyEntryForm = (props) => {
  // // set a new value for codemirror only if loading from history or changing query type
  // useEffect(() => {
  //   if (!bodyIsNew) setValue(bodyContent);
  // }, [bodyContent]);

  const {
    newRequestBodySet,
  } = props;
  const newRequestBody = useSelector((store: RootState) => store.newRequest.newRequestBody)
  const { bodyContent, bodyIsNew } = newRequestBody

  const isDark = useSelector((store: RootState) => store.ui.isDark);
  const [cmValue, setValue] = useState(bodyContent);



  return (
    <div className="mt-3">
      {
        // conditionally render warning message
        // warningMessage ? <div>{warningMessage.body}</div> : null
      }
      <div className="composer-section-title">Body</div>
      <div
        id="gql-body-entry"
        className={`${isDark ? 'is-dark-400' : ''}is-neutral-200-box p-3`}
      >
        <CodeMirror
          value={cmValue}
          theme="dark"
          height="200px"
          width="100%"
          maxHeight="300px"
          // GraphQL mode currently not available via react-codemirror. Below functionality is commented out since it cannot be used
          // In the future, if graphql mode gets ported and CodeMirror can integrate schema again, maybe add back in?

          // onBeforeChange={(editor, data, value) => {
          //   const optionObj = {
          //     schema: introspectionData.clientSchema,
          //     completeSingle: false,
          //   };
          //   setValue(value);
          //   editor.setOption('lint', optionObj);
          //   editor.setOption('hintOptions', optionObj);
          // }}

          onChange={(value, viewUpdate) => {
            newRequestBodySet({
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

export default TRPCBodyEntryForm;
