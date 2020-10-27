import React from 'react';
import {UnControlled as CodeMirror} from 'react-codemirror2';


export default function TextCodeAreaEditable ({ value, mode, onChange, theme }) {

  return (
    <div className='is-neutral-200-box p-3'>
      <CodeMirror
        value={value}
        options={{
          mode: mode,
          theme: theme || 'neo sidebar',
          lineNumbers: true,
          tabSize: 4,
          lineWrapping: true,
          readOnly: true,
        }}
        onChange={onChange}
      />
    </div>
  );
}