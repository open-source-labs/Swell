import React, { useState } from 'react';
import { useAppSelector } from '~/toolkit/store';

import { type NewRequestStreams, type $TSFixMe } from '~/types';
import grpcController from '~/controllers/grpcController';

import GRPCAutoInputForm from './GRPCAutoInputForm';
import TextCodeArea from '../sharedComponents/TextCodeArea';

interface GRPCProtoEntryFormProps {
  newRequestStreams: NewRequestStreams;
  newRequestStreamsSet: $TSFixMe;
}

const GRPCProtoEntryForm: React.FC<GRPCProtoEntryFormProps> = (props) => {
  const [protoError, showError] = useState(null);
  const [changesSaved, saveChanges] = useState(false);

  // import proto file via electron file import dialog and have it displayed in proto textarea box
  const importProtos = () => {
    grpcController.importProto(props.newRequestStreams);
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
      try {
        grpcController.sendParserData(props.newRequestStreams.protoContent);
        grpcController.protoParserReturn(props.newRequestStreams);
        saveChanges(true);
      } catch (err) {
        console.log(err);
        saveChanges(false);
      }
    }
    return;
  };

  const isDark = useAppSelector((state) => state.ui.isDark);
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
