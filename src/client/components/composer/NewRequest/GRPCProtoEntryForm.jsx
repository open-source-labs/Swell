import React, { Component } from 'react';
import dropDownArrow from '../../../../assets/icons/arrow_drop_down_white_192x192.png';
import { remote } from 'electron';
import fs from 'fs';
import GRPCAutoInputForm from "./GRPCAutoInputForm.jsx";
import protoParserFunc from "../protos/protoParser.js";
import { runInThisContext } from 'vm';

class GRPCProtoEntryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
    };
    // need to bind the 'this' of the event handler to the component instance when it is being rendered
    this.toggleShow = this.toggleShow.bind(this);
    this.importProtos = this.importProtos.bind(this);
    this.submitUpdatedProto = this.submitUpdatedProto.bind(this);
  }
  // event handler on the arrow button that allows you to open/close the section 
  toggleShow() {
    this.setState({
      show: !this.state.show
    });
  }
  // import proto file via electron file import dialog and have it displayed in proto textarea box
  importProtos() {
    // save current selections in case user hits the cancel button instead of importing a new proto file
    const savedProtoContent = this.props.newRequestBody.protoContent;
    const savedSelectedPackage = this.props.newRequestStreams.selectedPackage;
    const savedServices = this.props.newRequestStreams.savedServices;
    const savedRequest = this.props.newRequestStreams.savedRequest;
    const savedStreamingType = this.props.newRequestStreams.selectedStreamingType;
    // upon clicking the import proto button, if the protoContent contains any code,
    // reset selected package name, service, request, streaming type, array of streams, and the stream query content
    if (this.props.newRequestBody.protoContent !== null) {
      this.props.setNewRequestStreams({
        ...this.props.newRequestStreams,
        selectedPackage: null,
        selectedService: null,
        selectedRequest: null,
        selectedStreamingType: null
      });
      // clears the protocontent textarea by reseting it to an empty string in state of the store
      this.props.setNewRequestBody({
        ...this.props.newRequestBody,
        protoContent: ''
      });
      // grabs the service dropdown list and resets it to the first option "Select Service"
      document.getElementById('dropdownService').selectedIndex = 0;

    }
    remote.dialog.showOpenDialog({
      buttonLabel : "Import Proto File",
      properties: ['openFile', 'multiSelections'],
      // limits the client to only importing .proto files
      filters: [
        { name: 'Protos', extensions: ['proto'] },
      ]
    })
    .then(filePaths => {
      if (!filePaths) {
        return;
      }
      // read uploaded proto file
      const importedProto = fs.readFileSync(filePaths.filePaths[0], 'utf-8');
      // set state of protoContent in the store
      this.props.setNewRequestBody({
        ...this.props.newRequestBody,
        protoContent: importedProto
      });
      // parse proto file via protoParserFunc imported from protoParser.js
      protoParserFunc(this.props.newRequestBody.protoContent)
      .then(data => {
        // save parsed proto file details to state in the store
        this.props.setNewRequestStreams({
          ...this.props.newRequestStreams,
          services: data.serviceArr,
          protoPath: data.protoPath
        })
      }).catch((err) => console.log(err));
    });
    // to account for when the client hits cancel -- DOES NOT WORK, NEED TO REVISIT
    // if (this.props.newRequestBody.protoContent === '') {
    //   this.props.setNewRequestStreams({
    //     ...this.props.newRequestStreams,
    //     selectedPackage: savedSelectedPackage,
    //     selectedService: savedServices,
    //     selectedRequest: savedRequest,
    //     selectedStreamingType: savedStreamingType,
    //   });
    //   this.props.setNewRequestBody({
    //     ...this.props.newRequestBody,
    //     protoContent: savedProtoContent
    //   });
    // }
  }
  // save protoContent to state in the store whenever the client makes any changes to the proto file 
  // or pastes a copy of their proto file
  updateProtoBody(value) {
    this.props.setNewRequestBody({
      ...this.props.newRequestBody,
      protoContent: value
    })
  }
  // separate button to update protoContent state in the store after client make edits after initial file import
  // so the protoParserFunc doesn't fire every time client makes any changes
  submitUpdatedProto() {
    protoParserFunc(this.props.newRequestBody.protoContent)
    .then(data => {
      this.props.setNewRequestStreams({
        ...this.props.newRequestStreams,
        services: data.serviceArr,
        protoPath: data.protoPath
      })
    }).catch((err) => console.log(err));
    // changes the button label from "Save Changes" to "Changes Saved"
    document.getElementById("save-proto").innerText = 'Changes Saved ✓';
  }
  render() {
    // arrow button used to collapse or open the Proto section
    const arrowClass = this.state.show ? 'composer_subtitle_arrow-open' : 'composer_subtitle_arrow-closed';
    const bodyContainerClass = this.state.show ? 'composer_bodyform_container-open' : 'composer_bodyform_container-closed';
    /*
    pseudocode for the return section
     - first div renders the arrow button along with the title "Proto"
     - textarea has a default value and will changw when a proto file is imported or pasted in
     - the 2 buttons allow you to import a proto file or save any changes made to the textarea in the state of the store
     - the GRPCAutoInputForm component renders the section with the dropdown lists for services and requests
     */
    return (
      <div >
        <div className='composer_subtitle' onClick={this.toggleShow} style={this.props.stylesObj}>
          <img className={arrowClass} src={dropDownArrow}></img>
          Proto
        </div>

        <textarea
          value={this.props.newRequestBody.protoContent}
          className={'composer_textarea grpc ' + bodyContainerClass}
          id='grpcProtoEntryTextArea'
          type='text'
          placeholder='Import .proto file or paste a copy'
          rows={8}
          onChange={e => this.updateProtoBody(e.target.value)}
        ></textarea>

        <button className="import-proto" onClick={this.importProtos}>Import Proto File</button>
        <button id="save-proto" className="save-proto" onClick={this.submitUpdatedProto}>Save Changes</button>

        <GRPCAutoInputForm
          newRequestBody={this.props.newRequestBody}
          setNewRequestBody={this.props.setNewRequestBody}
          newRequestStreams={this.props.newRequestStreams}
          setNewRequestStreams={this.props.setNewRequestStreams}
        />
      </div>
    );
  }
}

export default GRPCProtoEntryForm;
