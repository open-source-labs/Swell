/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import WWWField from './WWWField.jsx';

class WWWForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wwwFields : [],
      fieldCount : 0,
      rawString : '',
    }
    this.updateWwwField = this.updateWwwField.bind(this);
  }

  componentDidMount () {
    let matches = this.props.newRequestBody.bodyContent.match(/(([^(&|\n)]+=[^(&|\n)]+)&?)+/g);
    if (matches) {
      this.props.setNewRequestBody({
        ...this.props.newRequestBody,
        bodyContent : matches.join(''),
      });
    } else {
      this.props.setNewRequestBody({
        ...this.props.newRequestBody,
        bodyContent : '',
      });
      
    }
    // if (this.props.newRequestBody.bodyContent !== '') {
    //   this.props.setNewRequestBody({
    //     ...this.props.newRequestBody,
    //     bodyContent : '',
    //   })
    //   return;
    // }
    this.addFieldIfNeeded ();
  }

  componentDidUpdate () {
    //create state from the incoming string, 
    if (this.props.newRequestBody.bodyContent !== this.state.rawString) {
      //if there is only one k/v pair...
      if (!this.props.newRequestBody.bodyContent.includes('&')) {
        let key = this.props.newRequestBody.bodyContent.split('=')[0];
        let value = this.props.newRequestBody.bodyContent.split('=')[1];

        this.setState({
          wwwFields : [{
            id : Math.floor(Math.random() * 100000),
            active : true,
            key,
            value,
          }],
          fieldCount : 1,
          rawString : this.props.newRequestBody.bodyContent
        }, () => {
          this.addFieldIfNeeded ();
        })
      } 
      //more than one k/v pair
      else if (this.props.newRequestBody.bodyContent.includes('&')) {
        let fields = this.props.newRequestBody.bodyContent.split('&')
        .map(field => {
          let key = field.split('=')[0];
          let value = field.split('=')[1];
          return {
            id : Math.floor(Math.random() * 100000),
            active : true,
            key,
            value,
          }
        })
        .filter(field => field.key !== '' || field.value !== '');

        this.setState({
          wwwFields : fields,
          fieldCount : fields.length - 1,
          rawString : this.props.newRequestBody.bodyContent
        },() => {
          this.addFieldIfNeeded ();
        });
      }
    }
  }

  updateWwwField(id, changeField, value) {
    const wwwFieldsDeepCopy = this.state.wwwFields.map((wwwField) => {
      if (wwwField.id === id) {
        wwwField[changeField] = value;
        wwwField.active = true;
      }
      return wwwField;
    });

    let bodyContent = wwwFieldsDeepCopy
    .filter(wwwField => wwwField.active)
    .map(wwwField => `${wwwField.key}=${wwwField.value}`)
    .join('&');

    this.props.setNewRequestBody({
      ...this.props.newRequestBody,
      bodyContent,
    });
  }

  addFieldIfNeeded() {
    if (this.shouldAddField()) {
      const wwwFieldsDeepCopy = JSON.parse(JSON.stringify(this.state.wwwFields));

      wwwFieldsDeepCopy.push({
        id: Math.floor(Math.random() * 100000),
        active: false,
        key: '',
        value: '',
      });
  
      this.setState ({
        wwwFields : wwwFieldsDeepCopy,
      });
    }
  }

  shouldAddField() {
    if (this.state.wwwFields.length === 0) {
      return true;
    }

    return this.state.wwwFields
      .map(wwwField => (wwwField.key === '' && wwwField.value === '' ? 1 : 0))
      .reduce((acc, cur) => acc + cur) === 0;
  }

  render () {
    let wwwFieldsReactArr = this.state.wwwFields.map((wwwField, index) => {
      return (
        <WWWField key={index} id={wwwField.id} active={wwwField.active} Key={wwwField.key} value={wwwField.value} updateCallback={this.updateWwwField} />
      )
  })

    return (
      <div
        style={{
          border: '1px solid black',
          margin: '3px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {wwwFieldsReactArr}
      </div>
    );
  }
}

WWWForm.propTypes = {
  newRequestBody: PropTypes.object.isRequired,
  setNewRequestBody: PropTypes.func.isRequired,
};

export default WWWForm;
