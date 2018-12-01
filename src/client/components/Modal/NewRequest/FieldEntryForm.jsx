import React, { Component } from 'react';
import { connect } from "react-redux";
import * as actions from '../../../actions/actions';
import ProtocolSelect from "./ProtocolSelect.jsx";
import PropTypes from "prop-types";

const mapStateToProps = store => ({
  newRequestFields : store.business.newRequestFields,
});

const mapDispatchToProps = dispatch => ({
  setNewRequestFields : (requestFields) => {
    dispatch(actions.setNewRequestFields(requestFields));
  },
  setNewRequestBody : (requestBodyObj) => {
    dispatch(actions.setNewRequestBody(requestBodyObj));
  },
});

class FieldEntryForm extends Component {
  constructor(props) {
    super(props);
  }

  onChangeHandler(e, property) {
    let value = e.target.value;
    switch (property) {
      case 'url' : {
        let url = this.props.newRequestFields.protocol + value.replace(/(h?.?t?.?t?.?p?.?s?.?|w?.?s?.?)(:[^\/]?\/?.?\/?)/, '')

        this.props.setNewRequestFields({
          ...this.props.newRequestFields,
          url: url,
        })
        break;
      }
      case 'protocol' : {
        let url = value + this.props.newRequestFields.url.replace(/(h?t?t?p?s?|w?s?):\/?\/?/, '');

        this.props.setNewRequestFields({
          ...this.props.newRequestFields,
          url: url,
          protocol : value,
        })
        break;
      }
      case 'method' : {
        if (value === 'GET') {
          this.props.setNewRequestBody ({
            ...this.props.newRequestBody,
            bodyContent : '',
          });
        }
        this.props.setNewRequestFields({
          ...this.props.newRequestFields,
          method : value,
        })
      }
    }
  };

  render() {
    // console.log(this.props);
    let HTTPMethodStyle = {
      display : this.props.newRequestFields.protocol !== 'ws://' ? 'block' : 'none',
    }

    return(
      // <div style={this.props.stylesObj}>
      <div>
        <ProtocolSelect currentProtocol={this.props.newRequestFields.protocol} onChangeHandler={this.onChangeHandler}/>

        <select style={HTTPMethodStyle} value={this.props.newRequestFields.method} className={'HTTPMethodStyle modal_select'} onChange={(e) => {
          this.onChangeHandler(e, 'method')
        }}>
          <option value='GET'>GET</option>
          <option value='POST'>POST</option>
          <option value='PUT'>PUT</option>
          <option value='PATCH'>PATCH</option>
          <option value='DELETE'>DELETE</option>
        </select>

        <input className={'modal_url-input'} type='text' placeholder='URL' value={this.props.newRequestFields.url} onChange={(e) => {
          this.onChangeHandler(e, 'url')
        }}></input>
      </div>
    )
  }
}

FieldEntryForm.propTypes = {
  // stylesObj : PropTypes.object.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FieldEntryForm);