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
    clearStreamBodies();
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
        streamContent: props.newRequestStreams.streamContent,
        protoContent: "",
      });
    }

    api.receive("proto-info", (readProto, parsedProto) => {
      console.log(
        "received from main readProto : ",
        readProto,
        "and parsed Proto : ",
        parsedProto
      );
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
    // document.getElementById("save-proto").innerText = "Save Changes";
    saveChanges(false);
  };

  // clears stream body query when proto file or selected service is changed
  const clearStreamBodies = () => {
    const streamsArr = props.newRequestStreams.streamsArr;
    const streamContent = props.newRequestStreams.streamContent;
    // clears all stream query bodies except the first one
    while (streamsArr.length > 1) {
      streamsArr.pop();
      streamContent.pop();
      props.newRequestStreams.count -= 1;
    }
    // reset first query to an empty string & streaming type to default value
    streamContent[0] = "";
    props.newRequestStreams.selectedStreamingType = null;
  };

  // update protoContent state in the store after making changes to the proto file
  const submitUpdatedProto = () => {
    // reset streaming type, select default for dropdowns, & set first stream query body to empty string

    props.newRequestStreams.streamContent[0] = "";
    // parse new updated proto file and save to store

    // instead of calling protoParserFunc directly from the file, which contains a bunch of node modules
    // and will break,
    // send a message to main to use protoParserFunc()
    // get message back with data
    // then call props.setNewRequestSTreams etc.. with the data

    api.receive("protoParserFunc-return", (data) => {
      if (data.error)
        showError(".proto parsing error: Please enter or import valid .proto");
      else showError(null);
      const services = data.serviceArr ? data.serviceArr : null;
      const protoPath = data.protoPath ? data.protoPath : null;

      props.setNewRequestStreams({
        ...props.newRequestStreams,
        selectedPackage: null,
        selectedService: null,
        selectedRequest: null,
        selectedStreamingType: null,
        selectedServiceObj: null,
        services,
        protoPath,
      });
    });

    api.send("protoParserFunc-request", props.newRequestStreams.protoContent);

    // changes the button label from "Save Changes" to "Changes Saved"
    // document.getElementById("save-proto").innerText = "Changes Saved";
    saveChanges(true);
  };

  const bodyContainerClass = show
    ? "composer_bodyform_container-open"
    : "composer_bodyform_container-closed";
  const smallBtn = show ? "small-btn-open" : "small-btn-closed";
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
        Save Changes
      </button>

      <GRPCAutoInputForm
        newRequestStreams={props.newRequestStreams}
        setNewRequestStreams={props.setNewRequestStreams}
        clearStreamBodies={clearStreamBodies}
        changesSaved={changesSaved}
        saveChanges={saveChanges}
      />
    </div>
  );
};

export default GRPCProtoEntryForm;
