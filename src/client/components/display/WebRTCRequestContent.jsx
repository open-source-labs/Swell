import React from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';

export default function WebRTCRequestContent({ request }) {
  const { body } = request;
  return (
    <div>
      <div className="p-3">
        <div>
          <div className="is-size-7">Servers</div>
          <CodeMirror
            value={body}
            options={{
              mode: 'application/json',
              theme: 'neo readonly',
              lineNumbers: true,
              tabSize: 4,
              lineWrapping: true,
              readOnly: true,
            }}
          />
        </div>
      </div>
    </div>
  );
}
