import React, { Component } from 'react';
import dropDownArrow from '../../../../assets/icons/arrow_drop_down_white_192x192.png';
import { remote } from 'electron';
import fs from 'fs';
import path from 'path';
import GRPCAutoInputForm from "./GRPCAutoInputForm.jsx";
import protoParserFunc from "../protos/protoParser.js";

class GRPCProtoEntryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
    };
    this.toggleShow = this.toggleShow.bind(this);
    this.importProtos = this.importProtos.bind(this);
    this.submitUpdatedProto = this.submitUpdatedProto.bind(this);
  }

  toggleShow() {
    this.setState({
      show: !this.state.show
    });
  }

  // import local proto file and have it uploaded to document body
  importProtos() {
    remote.dialog.showOpenDialog({
      buttonLabel : "Import Proto File",
      properties: ['openFile', 'multiSelections'],
      filters: [
        { name: 'Protos', extensions: ['proto'] },
      ]
    })
    .then(filePaths => {
      if (!filePaths) {
        return;
      }
      let importedProto = fs.readFileSync(filePaths.filePaths[0], 'utf-8');
      this.props.setNewRequestBody({
        ...this.props.newRequestBody,
        protoContent: importedProto
        // write to saveProto file
        // const dirName = remote.app.getAppPath();
        // fs.writeFileSync(path.join(dirName, 'src/client/components/composer/protos/saveProto.proto'), data, 'utf-8', (err) => {
        //   if(err){
        //       alert("An error ocurred writing the file :" + err.message);
        //       return;
        //   }
        //   console.log('Proto file has been saved')
        // })
      });
      let parsedProtoContent = protoParserFunc(this.props.newRequestBody.protoContent)
      .then(data => {
        // console.log(data);
        // console.log('after parser runs', data.serviceArr);
        // this.setState({
        //   ...this.state,
        //   services: data.serviceArr,
        //   protoPath: data.protoPath
        // })  
        this.props.setNewRequestStreams({
          ...this.props.newRequestStreams,
          services: data.serviceArr,
          protoPath: data.protoPath
        })
      }).catch((err) => console.log(err));
      // protoParser(this.props.newRequestBody.protoContent)
      // .then((data) => parsedProtoContent = data);
      // console.log(parsedProtoContent);
      //set state after successful invocation
    });
  }

  updateProtoBody(value) {
    this.props.setNewRequestBody({
      ...this.props.newRequestBody,
      protoContent: value
    })
  }

  submitUpdatedProto() {
    protoParserFunc(this.props.newRequestBody.protoContent)
    .then(data => { 
      this.props.setNewRequestStreams({
        ...this.props.newRequestStreams,
        services: data.serviceArr,
        protoPath: data.protoPath
      })
    }).catch((err) => console.log(err));
    document.getElementById("save-proto").innerText = 'Changes Saved ✓';
  }

  render() {
    const arrowClass = this.state.show ? 'composer_subtitle_arrow-open' : 'composer_subtitle_arrow-closed';
    const bodyContainerClass = this.state.show ? 'composer_bodyform_container-open' : 'composer_bodyform_container-closed';

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
          // style={{ 'resize': 'none' }}
          type='text'
          placeholder='Import .proto file or paste a copy'
          rows={8}
          onChange={e => this.updateProtoBody(e.target.value)}
          // onChange={(e) => {
          //   this.props.setNewRequestBody({
          //     ...this.props.newRequestBody,
          //     protoContent: e.target.value
          //   })
          // }}
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
