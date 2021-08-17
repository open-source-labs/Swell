import React, { useState } from 'react';
import TextCodeAreaEditable from './TextCodeAreaEditable.jsx';

const { api } = window;

const OpenAPIDocumentEntryForm = (props) => {
  const [show, toggleShow] = useState(true);
  const [protoError, showError] = useState(null);
  const [changesSaved, saveChanges] = useState(false);

  console.log(props.newRequestsOpenAPI);

  const importDocument = () => {
    // clear all stream bodies except first one upon clicking on import proto file
    console.log('importing document');
    // reset streaming type next to the URL & reset Select Service dropdown to default option
    // reset selected package name, service, request, streaming type & protoContent
    // if (props.newRequestStreams.protoContent !== null) {
    //   props.setNewRequestFields({
    //     ...props.newRequestFields,
    //     oppContent: '',
    //     streamsArr,
    //     streamContent,
    //     count: 1,
    //   });
    // }

    //listens for imported openapi document from main process
    api.receive('openapi-info', (readDocument, parsedDocument) => {
      console.log('received openapi-info', parsedDocument);
      const { openapiMetadata, openapiReqArray } = parsedDocument;
      saveChanges(true);
      props.setNewRequestsOpenAPI({
        openapiMetadata,
        openapiReqArray,
        //   openapiContent: parsedDocument,
        //   version: parsedDocument.openapi,
        //   info: parsedDocument.info,
        //   serversGlobal: parsedDocument.servers,
        //   tags: parsedDocument.tags,
      });
    });
    api.send('import-openapi');
  };

  // saves protoContent in the store whenever client make changes to proto file or pastes a copy
  // const updateDocumentBody = (value) => {
  //   showError(null);
  //   props.setNewRequestFields({
  //     ...props.newRequestFields,
  //     openapiContent: value,
  //   });
  //   saveChanges(false);
  // };

  // update protoContent state in the store after making changes to the proto file
  // const submitUpdatedDocument = () => {
  //   //only update if changes aren't saved
  //   if (!changesSaved) {
  //     // parse new updated proto file and save to store
  //     api.receive('openApiParserFunc-return', (data) => {
  //       if (data.error) {
  //         showError(
  //           '.openapi document parsing error: Please enter or import valid .proto'
  //         );
  //         saveChanges(false);
  //       } else {
  //         showError(null);
  //         saveChanges(true);
  //       }
  //       // const services = data.serviceArr ? data.serviceArr : null;
  //       // const protoPath = data.protoPath ? data.protoPath : null;
  //       // const streamsArr = [props.newRequestStreams.streamsArr[0]];
  //       // const streamContent = [''];

  //       props.setNewRequestStreams({
  //         ...props.newRequestStreams,

  //       });
  //     });

  //     api.send('openApiParserFunc-request', props.newRequestStreams.openapiContent);
  //   }
  // };

  const saveChangesBtnText = changesSaved ? 'Changes Saved' : 'Save Changes';

  return (
    <div className="mt-1">
      <div className="is-flex is-justify-content-space-between is-align-content-center">
        <div className="composer-section-title">Document</div>
        <div>
          <button
            className="button is-small add-header-or-cookie-button mr-1"
            onClick={importDocument}
          >
            Load Document
          </button>
          <button
            className="button is-small add-header-or-cookie-button"
            id="save-openapi"
            // onClick={submitUpdatedDocument}
          >
            {saveChangesBtnText}
          </button>
        </div>
      </div>

      <div className="is-danger subtitle">{protoError}</div>
      <div id="openapiEntryTextArea">
        <TextCodeAreaEditable
          id="openapiEntryTextArea"
          // onChange={(editor, data, value) => updateDocumentBody(value)}
          value={JSON.stringify(props.newRequestFields.openapiContent)}
          mode="application/javascript"
        />
      </div>
    </div>
  );
};

export default OpenAPIDocumentEntryForm;
