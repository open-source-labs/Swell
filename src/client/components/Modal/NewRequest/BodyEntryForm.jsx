import React, { Component } from 'react';
import PropTypes from "prop-types";
import WWWForm from './WWWForm.jsx';
import BodyTypeSelect from './BodyTypeSelect.jsx';
import JSONTextArea from './JSONTextArea.jsx';

class BodyEntryForm extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let rawTypeStyles = {
      'display' : this.props.bodyType === 'raw' ? 'block' : 'none',
    }

    let bodyEntryArea = (() => {
      //BodyType of none : display nothing
      if (this.props.bodyType === 'none'){
        return;
      }
      //BodyType of XWWW... : display WWWForm entry
      else if (this.props.bodyType === 'x-www-form-urlencoded'){
        return (<WWWForm updateBody={this.props.updateBodyContent}/>)
      }
      //RawType of application/json : Text area box with error checking
      else if (this.props.rawType === 'application/json') {
        if (this.props.bodyContent === "") {
          this.props.updateBodyContent({});
          return;
        }
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
          <textarea style={{'resize' : 'none'}} type='text' placeholder='Body' rows={5} onChange={(e) => {
            this.props.updateBodyContent(e.target.value)
          }} ></textarea>
        )
      }
    })()
  
    return(
      <div style={this.props.stylesObj}>

        <BodyTypeSelect updateBodyType={this.props.updateBodyType} bodyType={this.props.bodyType}/>

        <select onChange={(e) => this.props.updateRawType(e.target.value)} style={rawTypeStyles} value={this.props.rawType}>
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
  bodyContent : PropTypes.string.isRequired,
  updateBodyContent : PropTypes.func.isRequired,
  bodyType : PropTypes.string.isRequired,
  updateBodyType : PropTypes.func.isRequired,
  rawType : PropTypes.string.isRequired,
  updateRawType : PropTypes.func.isRequired,
  JSONFormatted : PropTypes.bool.isRequired,
  updateJSONFormatted : PropTypes.func.isRequired,
};

export default BodyEntryForm;