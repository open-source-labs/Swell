import React, { useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import TextCodeArea from './TextCodeArea.jsx';

export default function JSONTextArea({ newRequestBody, setNewRequestBody }) {
  useEffect(() => {
    try {
      JSON.parse(newRequestBody.bodyContent);
      if (!newRequestBody.JSONFormatted) {
        setNewRequestBody({
          ...newRequestBody,
          JSONFormatted: true,
        });
      }
    } catch (error) {
      if (newRequestBody.JSONFormatted) {
        setNewRequestBody({
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
        setNewRequestBody({
          ...newRequestBody,
          bodyContent: value,
        });
      }}
      value={newRequestBody.bodyContent}
    />
  );
}
