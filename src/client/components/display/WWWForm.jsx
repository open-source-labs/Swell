import React, { Component } from 'react';
import PropTypes from "prop-types";

import WWWField from './WWWField.jsx';

class WWWForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wwwFields : [],
      fieldCount : 0,
    }
    this.updateWwwField = this.updateWwwField.bind(this);
  }

  componentDidMount () {
    this.addFieldIfNeeded ();
  }

  componentDidUpdate () {
    this.props.updateBody(this.state.wwwFields
      .filter(wwwField => wwwField.active)
      .map(wwwField => `${wwwField.key}=${wwwField.value}`)
      .join('&'));
  }

  updateWwwField (id, changeField, value) {

    let wwwFieldsDeepCopy = this.state.wwwFields.map(wwwField => {
      if(wwwField.id === id) {
        wwwField[changeField] = value;
        wwwField.active = true;
      }
      return wwwField;
    });

    this.setState({
      wwwFields : wwwFieldsDeepCopy,
    }, () => {
      this.addFieldIfNeeded()
    })
  }

  addFieldIfNeeded () {
    if (this.shouldAddField ()) {
      let wwwFieldsDeepCopy = JSON.parse(JSON.stringify(this.state.wwwFields));
      
      wwwFieldsDeepCopy.push({
        id : Math.floor(Math.random() * 100000),
        active : false,
        key : '',
        value : '',
      });
  
      this.setState ({
        wwwFields : wwwFieldsDeepCopy
      }, () => {
      })
    }
  }

  shouldAddField () {
    if (this.state.wwwFields.length === 0) {
      return true;
    }

    return this.state.wwwFields.map(wwwField => {
      return (wwwField.key === '' && wwwField.value === '') ? 1 : 0;
    }).reduce((acc, cur) => {
      return acc + cur
    }) === 0 ? true : false;
  }

  render () {
    // console.log(this.state.wwwFields)
    let wwwFieldsReactArr = this.state.wwwFields.map((wwwField, index) => {
      return (
        <WWWField key={index} id={wwwField.id} active={wwwField.active} Key={wwwField.key} value={wwwField.value} updateCallback={this.updateWwwField} />
      )
  })

    return(
      <div style={{'border' : '1px solid black', 'margin' : '3px', 'display' : 'flex', 'flexDirection' : 'column'}}>
        WWWForm
        {wwwFieldsReactArr}
      </div>
    )
  }
}

WWWForm.propTypes = {
  updateBody: PropTypes.func.isRequired,
};

export default WWWForm