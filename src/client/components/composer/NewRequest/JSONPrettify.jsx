import React from 'react';

function JSONPrettify({ setNewRequestBody, newRequestBody }) {

  const prettyPrintJSON = () => {
    const prettyString = JSON.stringify(
      JSON.parse(newRequestBody.bodyContent),
      null,
      4
    );
    setNewRequestBody({
      ...newRequestBody,
      bodyContent: prettyString,
    });
  }

  return (
    <button 
      className = "button is-small is-white prettify-select "
      onClick={prettyPrintJSON}
    >
      Prettify
    </button>
  );

}

export default JSONPrettify;