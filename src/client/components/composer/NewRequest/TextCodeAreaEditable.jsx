//import { POINT_CONVERSION_UNCOMPRESSED } from 'constants';
import React from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
// TODO: refactor to remove react-codemirror2
// import CodeMirror from '@uiw/react-codemirror';
import 'codemirror/theme/neat.css';

export default function TextCodeAreaEditable({ value, mode, onChange, theme }) {
  return (
    <div className="is-neutral-200-box">
      <CodeMirror
        value={value}
        autoCursor={false}
        options={{
          mode,
          theme: theme || 'neat',
          lineNumbers: true,
          tabSize: 4,
          lineWrapping: true,
          pollInterval: 2000,
          readOnly: false,
        }}
        onChange={onChange}
      />
    </div>
  );
}
