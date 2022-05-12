import React from 'react';
import CodeMirror from '@uiw/react-codemirror';

export default function TextCodeAreaEditable({ value, mode, onChange, theme }) {
  return (
    <div className="is-neutral-200-box p-3">
      <CodeMirror
        value={value}
        options={{
          mode,
          theme: theme || 'neo sidebar',
          lineNumbers: true,
          tabSize: 4,
          lineWrapping: true,
          readOnly: true,
        }}
        onChange={onChange}
        height="200px"
      />
    </div>
  );
}
