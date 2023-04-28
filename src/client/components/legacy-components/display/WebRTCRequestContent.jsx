import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { EditorView } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';

const jBeautify = require('js-beautify').js;

export default function WebRTCRequestContent({ content }) {
  const { iceConfiguration } = content.request.body;

  return (
    <div className="p-3">
      <div className="is-size-7">Servers</div>
      <CodeMirror
        // value={jBeautify(JSON.stringify(iceConfiguration.iceServers))}
        theme={vscodeDark}
        readOnly="true"
        extensions={[javascript(), EditorView.lineWrapping]}
        height="100%"
        width="100%"
        maxHeight="300px"
      />
    </div>
  );
}
