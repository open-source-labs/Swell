import React, { Component } from 'react';
import dropDownArrow from '../../../../assets/icons/arrow_drop_down_white_192x192.png'
import { remote } from 'electron';
import fs from 'fs';
import GRPCAutoInputForm from "./GRPCAutoInputForm.jsx";

class GRPCBodyEntryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
    };
    this.toggleShow = this.toggleShow.bind(this);
    this.importProtos = this.importProtos.bind(this);
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
    }, (filePaths) => {
      if (!filePaths) {
        return;
      }
      fs.readFile(filePaths[0], 'utf-8', (err, data) => {
        if(err){
            alert("An error ocurred reading the file :" + err.message);
            return;
        }
        this.props.setNewRequestBody({
          ...this.props.newRequestBody,
          bodyContent: data
        });
      });
    });
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
          value={this.props.newRequestBody.bodyContent}
          className={'composer_textarea grpc ' + bodyContainerClass}
          id='grpcBodyEntryTextArea'
          style={{ 'resize': 'none' }} 
          type='text'
          placeholder='Type or import .proto file'
          rows={10}
          onChange={(e) => {
            this.props.setNewRequestBody({
              ...this.props.newRequestBody,
              bodyContent: e.target.value
            })
          }}
        ></textarea>
        <button className="import-proto" onClick={this.importProtos}>Import Proto File</button>
        <GRPCAutoInputForm
          newRequestBody={this.props.newRequestBody}
          setNewRequestBody={this.props.setNewRequestBody}
        />
      </div>
    );
  }
}

export default GRPCBodyEntryForm;
