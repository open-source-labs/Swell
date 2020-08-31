import React, { useState } from "react";
import GRPCAutoInputForm from "./GRPCAutoInputForm.jsx";
// import protoParserFunc from "../../../protoParser.js";

const { api } = window;

const GRPCProtoEntryForm = (props) => {
  const [show, toggleShow] = useState(true);
  const [protoError, showError] = useState(null);
  const [changesSaved, saveChanges] = useState(false);

  // import proto file via electron file import dialog and have it displayed in proto textarea box
  const importProtos = () => {
    // clear all stream bodies except first one upon clicking on import proto file
    let streamsArr = [props.newRequestStreams.streamsArr[0]];
    let streamContent = [""];
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
        protoContent: "",
        streamsArr,
        streamContent,
        count: 1,
      });
    }
    //listens for imported proto content from main process
    api.receive("proto-info", (readProto, parsedProto) => {
      saveChanges(true);
      props.setNewRequestStreams({
        ...props.newRequestStreams,
        protoContent: readProto,
        services: parsedProto.serviceArr,
        protoPath: parsedProto.protoPath,
      });
    });

    api.send("import-proto");
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
      api.receive("protoParserFunc-return", (data) => {
        if (data.error) {
          showError(
            ".proto parsing error: Please enter or import valid .proto"
          );
          saveChanges(false);
        } else {
          showError(null);
          saveChanges(true);
        }
        const services = data.serviceArr ? data.serviceArr : null;
        const protoPath = data.protoPath ? data.protoPath : null;
        const streamsArr = [props.newRequestStreams.streamsArr[0]];
        const streamContent = [""];

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

      api.send("protoParserFunc-request", props.newRequestStreams.protoContent);
    }
  };

  const bodyContainerClass = show
    ? "composer_bodyform_container-open"
    : "composer_bodyform_container-closed";
  const smallBtn = show ? "small-btn-open" : "small-btn-closed";

  const saveChangesBtnText = changesSaved ? "Changes Saved" : "Save Changes";
  /*
    pseudocode for the return section
     - first div renders the arrow button along with the title "Proto"
     - textarea has a default value which changes when a proto file is imported or pasted in
     - the 2 buttons allow you to import a proto file or save any changes made to the textarea in the state of the store
     - the GRPCAutoInputForm component renders the section with the dropdown lists for services and requests
     */
  return (
    <div>
      <label className="composer_subtitle">
        <div className="label-text" id="cookie-click">
          Proto
        </div>
        <div className="toggle">
          <input
            type="checkbox"
            name="check"
            className="toggle-state"
            onClick={() => toggleShow(!show)}
          />
          <div className="indicator" />
        </div>
      </label>
      <div className="warningMessage">{protoError}</div>
      <textarea
        value={props.newRequestStreams.protoContent}
        className={"composer_textarea grpc " + bodyContainerClass}
        id="grpcProtoEntryTextArea"
        type="text"
        placeholder="Import .proto file or paste a copy"
        rows={8}
        onChange={(e) => updateProtoBody(e.target.value)}
      />

      <button className={"import-proto " + smallBtn} onClick={importProtos}>
        Import Proto File
      </button>
      <button
        id="save-proto"
        className={"save-proto " + smallBtn}
        onClick={submitUpdatedProto}
      >
        {saveChangesBtnText}
      </button>

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
