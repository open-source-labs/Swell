//import { POINT_CONVERSION_UNCOMPRESSED } from 'constants';
import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';


export default function TextCodeAreaEditable({ value, mode, onChange, theme }) {
  return (
    <div className="is-neutral-200-box">
      <CodeMirror
            value="console.log('hello world!');"
            height="200px"
            // extensions={[javascript({ jsx: true })]}

        // value={value}
        // mode
        // theme={oneDark}
        // lineNumbers= {true}
        // tabSize= {4}
        // // extensions={[javascript()]}
        // lineWrapping= {true}
        // pollInterval= {2000}
        // readOnly= {false}
        onChange={onChange}
        // height="200px"
      />
    </div>
  );
}