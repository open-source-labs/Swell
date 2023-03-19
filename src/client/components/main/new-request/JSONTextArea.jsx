import React, { useEffect } from 'react';
import TextCodeArea from './TextCodeArea.tsx';

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
      onChange={(value) => {
        newRequestBodySet({
          ...newRequestBody,
          bodyContent: value,
        });
      }}
      value={newRequestBody.bodyContent}
    />
  );
}
