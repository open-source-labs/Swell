import React, { Component } from 'react';
import { connect } from "react-redux";
import * as actions from '../../../actions/actions';
import PropTypes from "prop-types";
import WWWForm from './WWWForm.jsx';
import BodyTypeSelect from './BodyTypeSelect.jsx';
import JSONTextArea from './JSONTextArea.jsx';

const mapStateToProps = store => ({
  newRequestBody : store.business.newRequestBody,
});

const mapDispatchToProps = dispatch => ({
  setNewRequestBody : (requestBodyObj) => {
    dispatch(actions.setNewRequestBody(requestBodyObj));
  },
});

class BodyEntryForm extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let rawTypeStyles = {
      'display' : this.props.newRequestBody.bodyType === 'raw' ? 'block' : 'none',
    }

    let bodyEntryArea = (() => {
      //BodyType of none : display nothing
      if (this.props.newRequestBody.bodyType === 'none'){
        return;
      }
      //BodyType of XWWW... : display WWWForm entry
      else if (this.props.newRequestBody.bodyType === 'x-www-form-urlencoded'){
        return (
          <WWWForm 
            setNewRequestBody={this.props.setNewRequestBody} 
            newRequestBody={this.props.newRequestBody}
          />)
      }
      //RawType of application/json : Text area box with error checking
      else if (this.props.newRequestBody.rawType === 'application/json') {
        return (
          <JSONTextArea 
            JSONFormatted={this.props.JSONFormatted} 
            updateJSONFormatted={this.props.updateJSONFormatted}
            bodyContent={this.props.bodyContent}
            updateBodyContent={this.props.updateBodyContent} 
          />
        )
      }
      //all other cases..just plain text area
      else {
        return (
          <textarea
            value={this.props.newRequestBody.bodyContent} 
            style={{'resize' : 'none'}} 
            type='text' 
            placeholder='Body' 
            rows={5} 
            onChange={(e) => {
              this.props.setNewRequestBody({
                ...this.props.newRequestBody,
                bodyContent : e.target.value
              })
            }}
          ></textarea>
        )
      }
    })()
  
    return(
      <div style={this.props.stylesObj}>

        <BodyTypeSelect setNewRequestBody={this.props.setNewRequestBody} newRequestBody={this.props.newRequestBody}/>

        <select 
          style={rawTypeStyles} 
          onChange={(e) => this.props.setNewRequestBody({
            ...this.props.newRequestBody,
            rawType : e.target.value,
          })} 
          value={this.props.newRequestBody.rawType}>
          Raw Type:
          <option value='text/plain'>Text (text/plain)</option>
          <option value='application/json'>JSON (application/json)</option>
          <option value='application/javascript'>Javascript (application/javascript)</option>
          <option value='application/xml'>XML (application/xml)</option>
          <option value='text/xml'>XML (text/xml)</option>
          <option value='text/html'>HTML (text/html)</option>
        </select>

        {bodyEntryArea}
      </div>
    )
  }
}

BodyEntryForm.propTypes = {
  stylesObj : PropTypes.object.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BodyEntryForm);