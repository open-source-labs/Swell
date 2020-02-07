import React, { Component } from 'react';
import { remote } from 'electron';
import fs from 'fs';
import GRPCAutoInputForm from "./GRPCAutoInputForm.jsx";
import protoParserFunc from "../protos/protoParser.js";
import dropDownArrow from '../../../../assets/icons/arrow_drop_down_white_192x192.png';

class GRPCProtoEntryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
    };
    // need to bind the 'this' of the event handler to the component instance when it is being rendered
    this.toggleShow = this.toggleShow.bind(this);
    this.importProtos = this.importProtos.bind(this);
    this.clearStreamBodies = this.clearStreamBodies.bind(this);
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
    // clear all stream bodies except first one upon clicking on import proto file
    this.clearStreamBodies();
    // reset streaming type next to the URL & reset Select Service dropdown to default option
    document.getElementById('stream').innerText = 'STREAM';
    document.getElementById('dropdownService').selectedIndex = 0;
    // reset selected package name, service, request, streaming type & protoContent
    if (this.props.newRequestStreams.protoContent !== null) {
      this.props.setNewRequestStreams({
        ...this.props.newRequestStreams,
        selectedPackage: null,
        selectedService: null,
        selectedRequest: null,
        selectedStreamingType: null,
        streamContent: this.props.newRequestStreams.streamContent,
        protoContent: ''
      });
    }
    // use electron dialog to import files that has .proto ext only
    remote.dialog.showOpenDialog({
      buttonLabel : "Import Proto File",
      properties: ['openFile', 'multiSelections'],
      filters: [ { name: 'Protos', extensions: ['proto'] } ]
    })
    .then(filePaths => {
      if (!filePaths) return;
      // read uploaded proto file & save protoContent in the store
      const importedProto = fs.readFileSync(filePaths.filePaths[0], 'utf-8');
      this.props.setNewRequestStreams({
        ...this.props.newRequestStreams,
        protoContent: importedProto
      });
      // parse proto file via protoParserFunc imported from protoParser.js & save parsed proto file details in the store
      protoParserFunc(this.props.newRequestStreams.protoContent)
      .then(data => {
        this.props.setNewRequestStreams({
          ...this.props.newRequestStreams,
          services: data.serviceArr,
          protoPath: data.protoPath
        })
      }).catch((err) => console.log(err));
    });
  }

  // saves protoContent in the store whenever client make changes to proto file or pastes a copy
  updateProtoBody(value) {
    this.props.setNewRequestStreams({
      ...this.props.newRequestStreams,
      protoContent: value
    })
  }

 // clears stream body query when proto file or selected service is changed
  clearStreamBodies() {
    const streamsArr = this.props.newRequestStreams.streamsArr;
    const streamContent = this.props.newRequestStreams.streamContent;
     // clears all stream query bodies except the first one
    while (streamsArr.length > 1) {
      streamsArr.pop();
      streamContent.pop()
      this.props.newRequestStreams.count -= 1;
    }
    // reset first query to an empty string & streaming type to default value
    streamContent[0] = '';
    this.props.newRequestStreams.selectedStreamingType = null;
  }

  // update protoContent state in the store after making changes to the proto file
  submitUpdatedProto() {
    // reset streaming type, select default for dropdowns, & set first stream query body to empty string
    document.getElementById('stream').innerText = 'STREAM';
    document.getElementById('dropdownService').selectedIndex = 0;
    document.getElementById('dropdownRequest').selectedIndex = 0;
    this.props.newRequestStreams.streamContent[0] = '';
    // parse new updated proto file and save to store
    protoParserFunc(this.props.newRequestStreams.protoContent)
    .then(data => {
      this.props.setNewRequestStreams({
        ...this.props.newRequestStreams,
        services: data.serviceArr,
        protoPath: data.protoPath
      })
    }).catch((err) => console.log(err));
  }
  
  render() {
    // arrow button used to collapse or open the Proto section
    const arrowClass = this.state.show ? 'composer_subtitle_arrow-open' : 'composer_subtitle_arrow-closed';
    const bodyContainerClass = this.state.show ? 'composer_bodyform_container-open' : 'composer_bodyform_container-closed';
    const smallBtn = this.state.show ? 'small-btn-open' : 'small-btn-closed';
    /*
    pseudocode for the return section
     - first div renders the arrow button along with the title "Proto"
     - textarea has a default value which changes when a proto file is imported or pasted in
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
          value={this.props.newRequestStreams.protoContent}
          className={'composer_textarea grpc ' + bodyContainerClass}
          id='grpcProtoEntryTextArea'
          type='text'
          placeholder='Import .proto file or paste a copy'
          rows={8}
          onChange={e => this.updateProtoBody(e.target.value)}
        ></textarea>

        <button className={'import-proto ' + smallBtn} onClick={this.importProtos}>Import Proto File</button>
        <button id="save-proto" className={'save-proto ' + smallBtn} onClick={this.submitUpdatedProto}>Save Changes</button>

        <GRPCAutoInputForm
          newRequestStreams={this.props.newRequestStreams}
          setNewRequestStreams={this.props.setNewRequestStreams}
          clearStreamBodies={this.clearStreamBodies}
        />
      </div>
    );
  }
}

export default GRPCProtoEntryForm;
