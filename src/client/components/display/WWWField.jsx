import React, { Component } from 'react';
import PropTypes from "prop-types";

import WWWField from './WWWField.jsx';

class WWWForm extends Component {
  constructor(props) {
    super(props)
  }

  render () {

    return(
      <div style={{ 'display' : 'flex'}}>
        <input type='checkbox' checked={this.props.active} onChange={() => {
          this.props.updateCallback(this.props.id, 'active', !this.props.active);
        }}></input>

        <input type='text' placeholder='Key' value={this.props.Key} onChange={(e) => {
          this.props.updateCallback(this.props.id, 'key', e.target.value);
        }}></input>

        <input type='text' placeholder='Value' value={this.props.value} onChange={(e) => {
          this.props.updateCallback(this.props.id, 'value', e.target.value);
        }}></input>
      </div>
    )
  }
}

WWWForm.propTypes = {
  id : PropTypes.number.isRequired,
  active : PropTypes.bool.isRequired,
  Key : PropTypes.string.isRequired,
  value : PropTypes.string.isRequired,
  updateCallback : PropTypes.func.isRequired,
};

export default WWWForm