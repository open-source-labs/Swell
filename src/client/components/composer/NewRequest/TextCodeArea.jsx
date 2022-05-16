//import { POINT_CONVERSION_UNCOMPRESSED } from 'constants';
import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { xml } from '@codemirror/lang-xml';
import { json } from '@codemirror/lang-json';
import { html } from '@codemirror/lang-html';
import { EditorView } from "@codemirror/view"


const langs = {
  "json": json,
  "xml": xml,
  "html": html,
  "javascript": javascript,
  "plain": xml // TODO: plaintext language is not yet supported in react codemirror (CM v6), please update when it becomes available
}

export default function TextCodeArea({ value, mode, onChange, theme = 'dark' , readOnly = false}) {
  const lang = mode.substring(mode.indexOf('/') + 1) // Grab language mode based on value passed in
  return (
    <div className="is-neutral-200-box">
      <CodeMirror
        value={value}
        height="200px"
        extensions={[
          langs[lang](),
          EditorView.lineWrapping,
        ]}
        placeholder='Enter body here'
        theme={theme}
        onChange={onChange}
        readOnly = {readOnly}
      />
    </div>
  );
}