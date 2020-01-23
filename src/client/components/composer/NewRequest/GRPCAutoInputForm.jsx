import React, { Component } from 'react';
import dropDownArrow from '../../../../assets/icons/arrow_drop_down_white_192x192.png'

class GRPCAutoInputForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
    };
    this.toggleShow = this.toggleShow.bind(this);
  }

  toggleShow() {
    this.setState({
      show: !this.state.show
    });
  }

  // parseData() {
    
  // }

  render() {
    const arrowClass = this.state.show ? 'composer_subtitle_arrow-open' : 'composer_subtitle_arrow-closed';
    const bodyContainerClass = this.state.show ? 'composer_bodyform_container-open' : 'composer_bodyform_container-closed';

    return (
      <div >
        <div className='composer_subtitle' onClick={this.toggleShow} style={this.props.stylesObj}>
          <img className={arrowClass} src={dropDownArrow}></img>
          Service & Request
        </div>

       <select id="dropdownService" name="dropdownService" className={'dropdownService ' + bodyContainerClass}>
          <option value="test1" selected="">Service1</option>
          <option value="test2">Service2</option>
        </select>

        <select id="dropdownRequest" name="dropdownRequest" className={'dropdownRequest ' + bodyContainerClass}>
          <option value="test1" selected="">Request1</option>
          <option value="test2">Request2</option>
        </select>
        {/* <textarea
          value={this.props.newRequestBody.bodyContent}
          className={'composer_textarea grpc ' + bodyContainerClass}
          id='grpcBodyEntryTextArea'
          style={{ 'resize': 'none' }} 
          type='text'
          placeholder='Select service and request you want to test'
          rows={5}
          onChange={(e) => {
            this.props.setNewRequestBody({
              ...this.props.newRequestBody,
              bodyContent: e.target.value
            })
          }}
        ></textarea> */}
      </div>
    );
  }
}

export default GRPCAutoInputForm;
