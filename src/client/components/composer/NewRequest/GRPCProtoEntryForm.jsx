import React, { useState } from "react";
import GRPCAutoInputForm from "./GRPCAutoInputForm.jsx";
// import protoParserFunc from "../../../protoParser.js";

const { api } = window;

const GRPCProtoEntryForm = (props) => {
  const [show, toggleShow] = useState(true);

  // import proto file via electron file import dialog and have it displayed in proto textarea box
  const importProtos = () => {
    // clear all stream bodies except first one upon clicking on import proto file
    clearStreamBodies();
    // reset streaming type next to the URL & reset Select Service dropdown to default option
    document.getElementById("stream").innerText = "STREAM";
    document.getElementById("dropdownService").selectedIndex = 0;
    // reset selected package name, service, request, streaming type & protoContent
    if (props.newRequestStreams.protoContent !== null) {
      props.setNewRequestStreams({
        ...props.newRequestStreams,
        selectedPackage: null,
        selectedService: null,
        selectedRequest: null,
        selectedStreamingType: null,
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

    // // use electron dialog to import files that has .proto ext only
    // remote.dialog.showOpenDialog({
    //   buttonLabel : "Import Proto File",
    //   properties: ['openFile', 'multiSelections'],
    //   filters: [ { name: 'Protos', extensions: ['proto'] } ]
    // })
    // .then(filePaths => {
    //   if (!filePaths) return;
    //   // read uploaded proto file & save protoContent in the store
    //   const importedProto = fs.readFileSync(filePaths.filePaths[0], 'utf-8');
    //   props.setNewRequestStreams({
    //     ...props.newRequestStreams,
    //     protoContent: importedProto
    //   });
    //   // parse proto file via protoParserFunc imported from protoParser.js & save parsed proto file details in the store
    //   protoParserFunc(props.newRequestStreams.protoContent)
    //   .then(data => {
    //     props.setNewRequestStreams({
    //       ...props.newRequestStreams,
    //       services: data.serviceArr,
    //       protoPath: data.protoPath
    //     })
    //   }).catch((err) => console.log(err));
    // });
  };

  // saves protoContent in the store whenever client make changes to proto file or pastes a copy
  const updateProtoBody = (value) => {
    props.setNewRequestStreams({
      ...props.newRequestStreams,
      protoContent: value,
    });
    document.getElementById("save-proto").innerText = "Save Changes";
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
    document.getElementById("stream").innerText = "STREAM";
    document.getElementById("dropdownService").selectedIndex = 0;
    document.getElementById("dropdownRequest").selectedIndex = 0;
    props.newRequestStreams.streamContent[0] = "";
    // parse new updated proto file and save to store

    // instead of calling protoParserFunc directly from the file, which contains a bunch of node modules
    // and will break,
    // send a message to main to use protoParserFunc()
    // get message back with data
    // then call props.setNewRequestSTreams etc.. with the data

    api.receive("protoParserFunc-return", (data) => {
      props.setNewRequestStreams({
        ...props.newRequestStreams,
        services: data.serviceArr,
        protoPath: data.protoPath,
      });
    });

    api.send("protoParserFunc-request", props.newRequestStreams.protoContent);
    /*

    protoParserFunc(props.newRequestStreams.protoContent)
      .then((data) => {
        props.setNewRequestStreams({
          ...props.newRequestStreams,
          services: data.serviceArr,
          protoPath: data.protoPath,
        });
      })
      .catch((err) => console.log(err));
*/

    // changes the button label from "Save Changes" to "Changes Saved"
    document.getElementById("save-proto").innerText = "Changes Saved";
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
      <label
        className='composer_subtitle' >
        <div className="label-text" id="cookie-click">Proto</div>
        <div className="toggle">
          <input type="checkbox" name="check" className="toggle-state" onClick={() => toggleShow(!show)}/>
          <div className="indicator_body" />
        </div>
      </label>
      
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
      />
    </div>
  );
};

export default GRPCProtoEntryForm;
