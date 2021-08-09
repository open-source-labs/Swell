import React, { useState, useEffect } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/theme/twilight.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror-graphql/hint';
import 'codemirror-graphql/lint';
import 'codemirror-graphql/mode';
import 'codemirror/addon/lint/lint.css';

const jBeautify = require('js-beautify').js;

const WebRTServerEntryForm = (props) => {
  const {
    newRequestBody: { bodyContent },
    newRequestBody: { bodyIsNew },
    warningMessage,
  } = props;

  const [cmValue, setValue] = useState('');

  // set a new value for codemirror only if loading from history or changing query type
  useEffect(() => {
    if (!bodyIsNew) setValue(bodyContent.iceConfiguration.iceServers);
  }, [bodyContent, bodyIsNew]);

  return (
    <div className="mt-3">
      {
        // conditionally render warning message
        warningMessage ? <div>{warningMessage.body}</div> : null
      }
      <div className="composer-section-title">TURN or STUN Servers</div>
      <div id="gql-body-entry" className="is-neutral-200-box p-3">
        <CodeMirror
          value={jBeautify(JSON.stringify(cmValue))}
          options={{
            mode: 'javascript',
            theme: 'neo sidebar',
            scrollbarStyle: 'native',
            lineNumbers: true,
            lint: true,
            hintOptions: true,
            matchBrackets: true,
            autoCloseBrackets: true,
            indentUnit: 1,
            tabSize: 1,
          }}
          editorDidMount={(editor) => {
            editor.setSize('100%', '100%');
          }}
        />
      </div>
    </div>
  );
};

export default WebRTServerEntryForm;
