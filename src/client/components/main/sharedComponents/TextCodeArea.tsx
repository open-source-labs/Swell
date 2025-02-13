import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { javascript } from '@codemirror/lang-javascript';
import { xml } from '@codemirror/lang-xml';
import { json } from '@codemirror/lang-json';
import { html } from '@codemirror/lang-html';
import { EditorView, ViewUpdate } from '@codemirror/view';
import { LanguageSupport } from '@codemirror/language';

interface TextCodeAreaProps {
  value: string;
  mode: string;
  onChange: (value: string, viewUpdate: ViewUpdate) => void;
  height?: string;
  width?: string;
  placeholder?: string;
  readOnly?: boolean;
}

const langs: { [key: string]: () => LanguageSupport } = {
  json: json,
  xml: xml,
  html: html,
  javascript: javascript,

  /**
   * @todo plaintext language is not yet supported in react-codemirror
   * (currently slated to be added in v6?), please update when it becomes
   * available
   */
  plain: xml,
};

export default function TextCodeArea({
  value,
  mode,
  onChange,
  height = '200px',
  placeholder = 'Enter body here',
  readOnly = false,
  width,
}: TextCodeAreaProps) {
  const lang: string = mode.substring(mode.indexOf('/') + 1); // Grab language mode based on value passed in
  return (
    <div className="is-neutral-200-box p-3">
      <CodeMirror
        value={value}
        height={height}
        width={width}
        extensions={[langs[lang](), EditorView.lineWrapping]}
        placeholder={placeholder}
        theme={vscodeDark}
        onChange={onChange}
        readOnly={readOnly}
      />
    </div>
  );
}

