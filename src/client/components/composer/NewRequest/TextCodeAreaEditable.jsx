//import { POINT_CONVERSION_UNCOMPRESSED } from 'constants';
import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { xml } from '@codemirror/lang-xml';
import { json } from '@codemirror/lang-json';
import { html } from '@codemirror/lang-html';


import { oneDark } from '@codemirror/theme-one-dark';


export default function TextCodeAreaEditable({ value, mode, onChange, theme = 'light' }) {
  return (
    <div className="is-neutral-200-box">
      <CodeMirror
        value={value}
        height="200px"
        extensions={[html()]}
        placeholder='Enter body here'
        // mode
        theme={theme}
        // lineNumbers= {true}
        // tabSize= {4}
        // lineWrapping= {true}
        // pollInterval= {2000}
        // readOnly= {false}
        onChange={onChange}
        // height="200px"
      />
    </div>
  );
}