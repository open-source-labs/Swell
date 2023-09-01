import React from 'react';
import { type NewRequestBody, type NewRequestBodySet } from '~/types';

interface Props {
  newRequestBodySet: NewRequestBodySet;
  newRequestBody: NewRequestBody;
}

function JSONPrettify({ newRequestBodySet, newRequestBody }: Props) {
  const prettyPrintJSON = () => {
    if (!newRequestBody.bodyContent) return;
    const prettyString = JSON.stringify(
      JSON.parse(newRequestBody.bodyContent),
      null,
      4
    );
    newRequestBodySet({
      ...newRequestBody,
      bodyContent: prettyString,
    });
  };

  return (
    <button
      className="button is-small is-white prettify-select "
      onClick={prettyPrintJSON}
    >
      Prettify
    </button>
  );
}

export default JSONPrettify;
