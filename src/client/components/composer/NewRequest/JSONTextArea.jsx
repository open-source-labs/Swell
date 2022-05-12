import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
// import CodeMirror from '@uiw/react-codemirror';
import TextCodeAreaEditable from './TextCodeAreaEditable.jsx';

export default function JSONTextArea({ newRequestBody, setNewRequestBody }) {
  useEffect(() => {
    if (newRequestBody.bodyContent === '') {
      setNewRequestBody({
        ...newRequestBody,
        bodyContent: '{\n  \n}',
      });
      return;
    }
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
    <TextCodeAreaEditable
      mode={newRequestBody.rawType}
      onChange={(editor, data, value) => {
        setNewRequestBody({
          ...newRequestBody,
          bodyContent: value,
        });
      }}
      value={newRequestBody.bodyContent}
    />
  );
}
