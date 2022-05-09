//import { POINT_CONVERSION_UNCOMPRESSED } from 'constants';
import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import 'codemirror/theme/neat.css';

export default function TextCodeAreaEditable({ value, mode, onChange, theme }) {
  return (
    <div className="is-neutral-200-box">
      <CodeMirror
        value={value}
        autocursor="false"
        options={{
          mode,
          theme: 'isotope',
          lineNumbers: true,
          tabSize: 4,
          lineWrapping: true,
          pollInterval: 2000,
          readOnly: false,
        }}
        onChange={onChange}
        height="200px"
      />
    </div>
  );
}
