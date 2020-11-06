import { POINT_CONVERSION_UNCOMPRESSED } from "constants";
import React, { useState, useEffect, useRef } from "react";
import {UnControlled as CodeMirror} from 'react-codemirror2';


export default function TextCodeAreaEditable ({ value, mode, onChange, theme }) {
  return (
    <div className='is-neutral-200-box p-3 mt-1'>
      <CodeMirror
        value={value}
        autoCursor={false}
        options={{
          mode: mode,
          theme: theme || 'neo sidebar',
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