import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import GRPCAutoInputForm from './GRPCAutoInputForm';
import TextCodeArea from '../new-request/TextCodeArea';
import grpcController from '../../../controllers/grpcController'
import { NewRequestStreams, $TSFixMe, WindowExt } from '../../../../types';
import { RootState } from '../../../toolkit-refactor/store';

const { api } = window as unknown as WindowExt;

interface GRPCProtoEntryFormProps {
  newRequestStreams: NewRequestStreams
  newRequestStreamsSet: $TSFixMe
}

const GRPCProtoEntryForm: React.FC<GRPCProtoEntryFormProps> = (props) => {
  // const [show, toggleShow] = useState(true);
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
      props.newRequestStreamsSet({
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
      props.newRequestStreamsSet({
        ...props.newRequestStreams,
        protoContent: readProto,
        services: parsedProto.serviceArr,
        protoPath: parsedProto.protoPath,
      });
    });
    api.send('import-proto');
  };

  // saves protoContent in the store whenever client make changes to proto file or pastes a copy
  const updateProtoBody = (value: $TSFixMe) => {
    showError(null);
    props.newRequestStreamsSet({
      ...props.newRequestStreams,
      protoContent: value,
    });
    saveChanges(false);
  };
  
  // update protoContent state in the store after making changes to the proto file
  const submitUpdatedProto = () => {
    //only update if changes aren't saved
    if (!changesSaved) {
      try{ 
        grpcController.sendParserData(props.newRequestStreams.protoContent);
        grpcController.protoParserReturn(props.newRequestStreams);
        saveChanges(true);
        
      } catch (err) {
        console.log(err);
        saveChanges(false);
      }
    }
    return
  };

  const isDark = useSelector((state: RootState) => state.ui.isDark);

  const saveChangesBtnText = changesSaved ? 'Changes Saved' : 'Save Changes';

  /*
    pseudocode for the return section
     - first div renders the arrow button along with the title "Proto"
     - textarea has a default value which changes when a proto file is imported or pasted in
     - the 2 buttons allow you to import a proto file or save any changes made to the textarea in the state of the store
     - the GRPCAutoInputForm component renders the section with the dropdown lists for services and requests
  */

  return (
    <div className="mt-5">
      <div className="is-flex is-justify-content-space-between is-align-content-center">
        <div className="composer-section-title">Proto</div>
        <div>
          <button
            className={`${
              isDark ? 'is-dark-300' : ''
            } button is-small add-header-or-cookie-button mr-1`}
            onClick={importProtos}
          >
            Load Proto
          </button>
          <button
            className={`${
              isDark ? 'is-dark-300' : ''
            } button is-small add-header-or-cookie-button`}
            id="save-proto"
            onClick={submitUpdatedProto}
          >
            {saveChangesBtnText}
          </button>
        </div>
      </div>
      <div className="is-danger subtitle">{protoError}</div>
      <div id="grpcProtoEntryTextArea">
        <TextCodeArea
          onChange={(value, viewUpdate) => updateProtoBody(value)}
          value={props.newRequestStreams.protoContent}
          mode="application/json"
          placeholder="Enter proto here"
        />
      </div>
      <GRPCAutoInputForm
        newRequestStreams={props.newRequestStreams}
        newRequestStreamsSet={props.newRequestStreamsSet}
        changesSaved={changesSaved}
        saveChanges={saveChanges}
      />
    </div>
  );
};

export default GRPCProtoEntryForm;
