import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import GRPCAutoInputForm from './GRPCAutoInputForm.jsx';
import TextCodeAreaEditable from './TextCodeAreaEditable.jsx';
// import protoParserFunc from "../../../protoParser.js";

const { api } = window;

const GRPCProtoEntryForm = (props) => {
  const [show, toggleShow] = useState(true);
  const [protoError, showError] = useState(null);
  const [changesSaved, saveChanges] = useState(false);

  // import proto file via electron file import dialog and have it displayed in proto textarea box
  const importProtos = () => {
    // clear all stream bodies except first one upon clicking on import proto file
    const streamsArr = [props.newRequestStreams.streamsArr[0]];
    const streamContent = [''];
    // reset streaming type next to the URL & reset Select Service dropdown to default option
    // reset selected package name, service, request, streaming type & protoContent
    if (props.newRequestStreams.protoContent !== null) {
      props.setNewRequestStreams({
        ...props.newRequestStreams,
        selectedPackage: null,
        selectedService: null,
        selectedRequest: null,
        selectedStreamingType: null,
        services: [],
        protoContent: '',
        streamsArr,
        streamContent,
        count: 1,
      });
    }
    //listens for imported proto content from main process
    api.receive('proto-info', (readProto, parsedProto) => {
      saveChanges(true);
      props.setNewRequestStreams({
        ...props.newRequestStreams,
        protoContent: readProto,
        services: parsedProto.serviceArr,
        protoPath: parsedProto.protoPath,
      });
    });

    api.send('import-proto');
  };

  // saves protoContent in the store whenever client make changes to proto file or pastes a copy
  const updateProtoBody = (value) => {
    showError(null);
    props.setNewRequestStreams({
      ...props.newRequestStreams,
      protoContent: value,
    });
    saveChanges(false);
  };

  // update protoContent state in the store after making changes to the proto file
  const submitUpdatedProto = () => {
    //only update if changes aren't saved
    if (!changesSaved) {
      // parse new updated proto file and save to store
      api.receive('protoParserFunc-return', (data) => {
        if (data.error) {
          showError(
            '.proto parsing error: Please enter or import valid .proto'
          );
          saveChanges(false);
        } else {
          showError(null);
          saveChanges(true);
        }
        const services = data.serviceArr ? data.serviceArr : null;
        const protoPath = data.protoPath ? data.protoPath : null;
        const streamsArr = [props.newRequestStreams.streamsArr[0]];
        const streamContent = [''];

        props.setNewRequestStreams({
          ...props.newRequestStreams,
          selectedPackage: null,
          selectedService: null,
          selectedRequest: null,
          selectedStreamingType: null,
          selectedServiceObj: null,
          services,
          protoPath,
          streamsArr,
          streamContent,
          count: 1,
        });
      });

      api.send('protoParserFunc-request', props.newRequestStreams.protoContent);
    }
  };
  
  const isDark = useSelector((state) => state.ui.isDark);

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
        <div className="composer-section-title">Proto</div>
        <div>
          <button
            className={`${isDark ? 'is-dark-300' : ''} button is-small add-header-or-cookie-button mr-1`}
            onClick={importProtos}
          >
            Load Proto
          </button>
          <button
            className={`${isDark ? 'is-dark-300' : ''} button is-small add-header-or-cookie-button`}
            id="save-proto"
            onClick={submitUpdatedProto}
          >
            {saveChangesBtnText}
          </button>
        </div>
      </div>

      <div className="is-danger subtitle">{protoError}</div>
      <div id="grpcProtoEntryTextArea">
        <TextCodeAreaEditable
          id="grpcProtoEntryTextArea"
          onChange={(editor, data, value) => updateProtoBody(value)}
          value={props.newRequestStreams.protoContent}
          mode="application/json"
        />
      </div>
      <GRPCAutoInputForm
        newRequestStreams={props.newRequestStreams}
        setNewRequestStreams={props.setNewRequestStreams}
        changesSaved={changesSaved}
        saveChanges={saveChanges}
      />
    </div>
  );
};

export default GRPCProtoEntryForm;
