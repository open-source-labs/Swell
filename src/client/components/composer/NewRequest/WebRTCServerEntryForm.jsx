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

const WebRTCServerEntryForm = (props) => {
  const {
    newRequestBody: { bodyContent },
    newRequestBody: { bodyIsNew },

    warningMessage,
  } = props;

  const [cmValue, setValue] = useState('');

  useEffect(() => {
    if (!bodyIsNew)
      setValue(
        jBeautify(JSON.stringify(bodyContent.iceConfiguration.iceServers))
      );
  }, [bodyContent, bodyIsNew]);

  return (
    <div className="mt-3">
      {warningMessage ? <div>{warningMessage.body}</div> : null}
      <div className="composer-section-title">TURN or STUN Servers</div>
      <div className="is-neutral-200-box p-3">
        <CodeMirror
          value={cmValue}
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
          editorDidMount={(editor, data, value) => {
            editor.setSize('100%', '100%');
          }}
        />
      </div>
    </div>
  );
};

export default WebRTCServerEntryForm;
