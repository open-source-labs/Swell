import React, { useState } from 'react';
import TextCodeAreaEditable from './TextCodeAreaEditable.jsx';

const { api } = window;

const OpenAPIDocumentEntryForm = (props) => {
  const [show, toggleShow] = useState(true);
  const [protoError, showError] = useState(null);

  const importDocument = () => {
    console.log('importing document');

    //listens for imported openapi document from main process
    api.receive('openapi-info', (readDocument, parsedDocument) => {
      console.log('received openapi-info', parsedDocument);

      props.setNewRequestsOpenAPI(parsedDocument);
    });
    api.send('import-openapi');
  };

  return (
    <div className="mt-3">
      <div className="is-flex is-justify-content-flex-end is-align-content-center">
        <button
          className="button is-small add-header-or-cookie-button mr-1"
          onClick={importDocument}
        >
          Load Document
        </button>
      </div>

      <div className="is-danger subtitle">{protoError}</div>
      {/* <div id="openapiEntryTextArea">
        <TextCodeAreaEditable
          id="openapiEntryTextArea"
          value={JSON.stringify(props.newRequestsOpenAPI)}
          mode="application/javascript"
        />
      </div> */}
    </div>
  );
};

export default OpenAPIDocumentEntryForm;
