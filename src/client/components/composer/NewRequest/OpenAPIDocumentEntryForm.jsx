import React, { useState } from 'react';
import TextCodeAreaEditable from './TextCodeAreaEditable.jsx';
import parsedDocument from '../../../docs/twitter-example.json';

const { api } = window;

const OpenAPIDocumentEntryForm = (props) => {
  const [show, toggleShow] = useState(true);
  const [protoError, showError] = useState(null);
  const [changesSaved, saveChanges] = useState(false);

  console.log(props.newRequestFields);

  
  const importDocument = () => {
    // clear all stream bodies except first one upon clicking on import proto file

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

    props.setNewRequestFields({
      ...props.newRequestFields,
      // this should be the un-parsed document eventually
      openapiContent: parsedDocument,
      version: parsedDocument.openapi,
      info: parsedDocument.info,
      serversGlobal: parsedDocument.servers,
      tags: parsedDocument.tags,

      reqResArray: [
        {
          id: 13,
          enabled: true, // user toggles state
          tags: ['Users'],
          method: 'post',
          headers: [],
          urls: [
            'http://api.twitter.com/2/users/13/blocking',
            'http://api.twitter.com/2/users/240/blocking',
            'http://api.twitter.com/2/users/24/blocking?required=false&TZ=utc%159',
          ],
          body: '', // JSON, user text input
          summary: 'Block User by User ID',
          description:
            'Causes the user (in the path) to block the target user. The user (in the path) must match the user context authorizing the request',
          operationId: 'usersIdBlock',
        },
      ],
    });

    //listens for imported proto content from main process
    api.receive('openapi-info', (readDocument, parsedDocument) => {
      console.log('received openapi-info',  parsedDocument);
      saveChanges(true);
       props.setNewRequestFields({
         ...props.newRequestFields,
        //  protContent: readProto,
        //  services: parsedProto.serviceArr,
        //  protoPath: parsedProto.protoPath,
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
  //     api.receive('protoParserFunc-return', (data) => {
  //       if (data.error) {
  //         showError(
  //           '.proto parsing error: Please enter or import valid .proto'
  //         );
  //         saveChanges(false);
  //       } else {
  //         showError(null);
  //         saveChanges(true);
  //       }
  //       const services = data.serviceArr ? data.serviceArr : null;
  //       const protoPath = data.protoPath ? data.protoPath : null;
  //       const streamsArr = [props.newRequestStreams.streamsArr[0]];
  //       const streamContent = [''];

  //       props.setNewRequestStreams({
  //         ...props.newRequestStreams,
  //         selectedPackage: null,
  //         selectedService: null,
  //         selectedRequest: null,
  //         selectedStreamingType: null,
  //         selectedServiceObj: null,
  //         services,
  //         protoPath,
  //         streamsArr,
  //         streamContent,
  //         count: 1,
  //       });
  //     });

  //     api.send('protoParserFunc-request', props.newRequestStreams.protoContent);
  //   }
  // };

  const saveChangesBtnText = changesSaved ? 'Changes Saved' : 'Save Changes';
  /*
    pseudocode for the return section
     - first div renders the arrow button along with the title "Proto"
     - textarea has a default value which changes when a proto file is imported or pasted in
     - the 2 buttons allow you to import a proto file or save any changes made to the textarea in the state of the store
     - the GRPCAutoInputForm component renders the section with the dropdown lists for services and requests
     */

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
            id="save-proto"
            // onClick={submitUpdatedDocument}
          >
            {saveChangesBtnText}
          </button>
        </div>
      </div>

      <div className="is-danger subtitle">{protoError}</div>
      <div id="grpcProtoEntryTextArea">
        <TextCodeAreaEditable
          id="grpcProtoEntryTextArea"
          // onChange={(editor, data, value) => updateDocumentBody(value)}
          value={JSON.stringify(props.newRequestFields.openapiContent)}
          mode="application/javascript"
        />
      </div>
    </div>
  );
};

export default OpenAPIDocumentEntryForm;
