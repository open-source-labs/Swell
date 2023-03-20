import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import CodeMirror from '@uiw/react-codemirror';
import { EditorView } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { json } from '@codemirror/lang-json';

const jBeautify = require('js-beautify').js;

const WebRTCServerEntryForm = (props) => {
  const { warningMessage } = props;
  const requestBody = useSelector((state) => state.newRequest.newRequestBody);
  const { bodyIsNew } = requestBody;
  const [cmValue, setValue] = useState('');
  const isDark = useSelector((state) => state.ui.isDark);

  const bodyContent = useSelector(
    (state) => state.newRequest.newRequestBody.bodyContent
  );
  useEffect(() => {
    if (!bodyIsNew) {
      /**
       * @todo This code randomly causes parts of the app to crash. As in, it
       * will randomly decide to start or stop working without you changing
       * anything. Need to investigate
       */
      setValue(
        jBeautify(JSON.stringify(bodyContent?.iceConfiguration?.iceServers))
      );
    }
  }, [bodyContent, bodyIsNew]);

  return (
    <div className="mt-3">
      {warningMessage ? <div>{warningMessage.body}</div> : null}
      <div className="composer-section-title">TURN or STUN Servers</div>
      <div className={`is-neutral-200-box p-3 ${isDark ? 'is-dark-400' : ''}`}>
        <CodeMirror
          value={cmValue}
          theme={vscodeDark}
          extensions={[javascript(), EditorView.lineWrapping]}
          height="100px"
        />
      </div>
    </div>
  );
};

export default WebRTCServerEntryForm;
