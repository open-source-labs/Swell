import React, { useState } from 'react';
import { useSelector } from 'react-redux';
const { api } = window;

const OpenAPIDocumentEntryForm = (props) => {
  const [protoError, showError] = useState(null);

  const importDocument = () => {
    console.log('importing document');
    //listens for imported openapi document from main process
    api.receive('openapi-info', (readDocument, parsedDocument) => {
      console.log('received openapi-info');

      props.openApiRequestsReplaced(parsedDocument);
    });
    api.send('import-openapi');
  };

  const isDark = useSelector((state) => state.ui.isDark);

  return (
    <div className="mt-3">
      <div className="is-flex is-justify-content-flex-end is-align-content-center">
        <button
          className={`${
            isDark ? 'is-dark-300' : ''
          } button is-small add-header-or-cookie-button mr-1`}
          onClick={importDocument}
        >
          Load Document
        </button>
      </div>
    </div>
  );
};

export default OpenAPIDocumentEntryForm;
