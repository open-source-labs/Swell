/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ContentReqRowComposer from './ContentReqRowComposer.jsx';

class WWWForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wwwFields: [],
      rawString: '',
    }
    this.updateWwwField = this.updateWwwField.bind(this);
    this.deleteWwwField = this.deleteWwwField.bind(this)
  }
  
  createWWWClone() {
    return JSON.parse(JSON.stringify(this.state.wwwFields))
  }
  
  checkOldBody() {
     //create state from the incoming string, 
    
      //if there is only one k/v pair...
      if (!this.props.newRequestBody.bodyContent.includes('&')) {
        let key = this.props.newRequestBody.bodyContent.split('=')[0];
        let value = this.props.newRequestBody.bodyContent.split('=')[1];
        console.log("this.state.wwwFields:", this.state.wwwFields)
        this.setState({
          wwwFields: [{
            id: `id${this.state.wwwFields.length}`,
            active: true,
            key,
            value,
          }],
          rawString: this.props.newRequestBody.bodyContent
        }, () => {
          this.addFieldIfNeeded();
        })
      }
      //more than one k/v pair
      else if (this.props.newRequestBody.bodyContent.includes('&')) {
        let fields = this.props.newRequestBody.bodyContent.split('&')
          .map(field => {
            let key = field.split('=')[0];
            let value = field.split('=')[1];
            return {
              id: `id${this.state.wwwFields.length}`,
              active: true,
              key,
              value,
            }
          })
          .filter(field => field.key !== '' || field.value !== '');

        this.setState({
          wwwFields: fields,
          rawString: this.props.newRequestBody.bodyContent
        })
      }
    } 
  

  componentDidMount() {
    //"hi"="rocky"&"meow"="cats" in the body turns into 2 key/value pairs when switching to x-www
    let matches = this.props.newRequestBody.bodyContent.match(/(([^(&|\n)]+=[^(&|\n)]+)&?)+/g);
    if (matches) {
      this.props.setNewRequestBody({
        ...this.props.newRequestBody,
        bodyContent: matches.join(''),
      });
    } else {
      this.props.setNewRequestBody({
        ...this.props.newRequestBody,
        bodyContent: '',
      });
    }
    this.addFieldIfNeeded();
  }

  

  componentDidUpdate() {
    if (this.props.newRequestBody.bodyContent !== this.state.rawString) {
    this.checkOldBody();
    }
    const wwwFieldsDeepCopy = this.createWWWClone();
    if (wwwFieldsDeepCopy.length === 0 || wwwFieldsDeepCopy[wwwFieldsDeepCopy.length-1]?.key !== "") { 
      this.addWwwField()
    } 
  }

  addWwwField() {
    const wwwFieldsDeepCopy = this.createWWWClone();
    wwwFieldsDeepCopy.push({
      id: `id${this.state.wwwFields.length}`,
      active: true,
      key: '',
      value: ''
    })
    console.log(wwwFieldsDeepCopy)
    this.setState({
      wwwFields: wwwFieldsDeepCopy
    });
  } 

  updateWwwField(id, field, value) {

    const wwwFieldsDeepCopy = this.createWWWClone();
    
    //find www to update
    let indexToBeUpdated;
    for (let i = 0; i < wwwFieldsDeepCopy.length; i++) {
      if (wwwFieldsDeepCopy[i].id === id) {
        indexToBeUpdated = i;
        break;
      }
    }
    const target = wwwFieldsDeepCopy[indexToBeUpdated]
    
    //update
    target[field] = value;

    //also switch checkbox if they are typing
    if (field === 'key' || field === 'value') {
      console.log('key or value')
      target.active = true;
      this.addWwwField();
    }

   
      this.setState({
        wwwFields: wwwFieldsDeepCopy,
      });
    
  }

  addFieldIfNeeded() {
    if (this.isWwwFieldsEmpty()) {
      const wwwFieldsDeepCopy = this.createWWWClone();

      wwwFieldsDeepCopy.push({
        id: `id${this.state.wwwFields.length}`,
        active: false,
        key: '',
        value: '',
      });

      this.setState({
        wwwFields: wwwFieldsDeepCopy,
      });
    }
  }

  isWwwFieldsEmpty() {
    if (this.state.wwwFields.length === 0) {
      return true;
    }

    return this.state.wwwFields
      .map(wwwField => (wwwField.key === '' && wwwField.value === '' ? 1 : 0))
      .reduce((acc, cur) => acc + cur) === 0;
  }

  deleteWwwField(index) {
    const newFields = this.state.wwwFields.slice();
    newFields.splice(index, 1);
    if (!newFields.length) {
      newFields.push({
        id: `id${this.state.wwwFields.length}`,
        active: false,
        key: '',
        value: '',
      });
    }
    this.setState({
      wwwFields: newFields,
    })
  }

  render() {
    let wwwFieldsReactArr = this.state.wwwFields.map((wwwField, index) => {
      return (
        <ContentReqRowComposer 
          index={index}
          deleteItem={this.deleteWwwField}
          data={wwwField} 
          changeHandler={this.updateWwwField}
          key={`crrcwwwfield${index}`}
        />
      )
    })

    return (
      <div
        className={'composer_headers_container-open'}
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
