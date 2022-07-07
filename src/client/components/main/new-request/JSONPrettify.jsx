import React from 'react';

function JSONPrettify({ newRequestBodySet, newRequestBody }) {
  const prettyPrintJSON = () => {
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
