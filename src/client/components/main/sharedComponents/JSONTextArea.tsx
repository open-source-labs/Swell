import React, { useEffect } from 'react';
import TextCodeArea from './TextCodeArea';
import { NewRequestBody, NewRequestBodySet } from '../../../../types';

interface JSONTextAreaProps {
  newRequestBody: NewRequestBody
  newRequestBodySet: NewRequestBodySet
}

export default function JSONTextArea({
  newRequestBody,
  newRequestBodySet,
}: JSONTextAreaProps) {
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
  }, [newRequestBody.bodyContent]);

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
