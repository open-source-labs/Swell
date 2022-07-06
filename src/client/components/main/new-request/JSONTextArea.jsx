import React, { useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import TextCodeArea from './TextCodeArea.jsx';

export default function JSONTextArea({ newRequestBody, newRequestBodySet }) {
  useEffect(() => {
    try {
      JSON.parse(newRequestBody.bodyContent);
      if (!newRequestBody.JSONFormatted) {
        newRequestBodySet({
          ...newRequestBody,
          JSONFormatted: true,
        });
      }
    } catch (error) {
      if (newRequestBody.JSONFormatted) {
        newRequestBodySet({
          ...newRequestBody,
          JSONFormatted: false,
        });
      }
    }
  });

  return (
    <TextCodeArea
      mode={newRequestBody.rawType}
      onChange={(value, viewUpdate) => {
        newRequestBodySet({
          ...newRequestBody,
          bodyContent: value,
        });
      }}
      value={newRequestBody.bodyContent}
    />
  );
}
