import React, { Component } from 'react';
import { connect } from "react-redux";
import * as actions from '../../../actions/actions';
import Header from './Header.jsx';

const mapStateToProps = store => ({
  newRequestHeaders : store.business.newRequestHeaders,
  newRequestBody : store.business.newRequestBody,
});

const mapDispatchToProps = dispatch => ({
  setNewRequestHeaders : (requestHeadersObj) => {
    dispatch(actions.setNewRequestHeaders(requestHeadersObj));
  },
});

class HeaderEntryForm extends Component {
  constructor(props) {
    super(props);
    this.onChangeUpdateHeader = this.onChangeUpdateHeader.bind(this);
  }

  componentDidMount () {
    let headersDeepCopy = JSON.parse(JSON.stringify(this.props.newRequestHeaders.headersArr));
    this.addHeader(headersDeepCopy);
  }

  componentDidUpdate () {
    if (this.props.newRequestHeaders.headersArr.length == 0) {
      let headersDeepCopy = JSON.parse(JSON.stringify(this.props.newRequestHeaders.headersArr));
      this.addHeader(headersDeepCopy);
    }
    this.checkContentTypeHeaderUpdate();
  }

  checkContentTypeHeaderUpdate () {
    let contentType;
    if (this.props.newRequestBody.bodyType === 'none'){
      contentType = '';
    }
    else if (this.props.newRequestBody.bodyType === 'x-www-form-urlencoded'){
      contentType = 'x-www-form-urlencoded';
    }
    else {
      contentType = this.props.newRequestBody.rawType;
    }

    //Attempt to update header in these conditions:
    let foundHeader = this.props.newRequestHeaders.headersArr.find(header => {
      return header.key.toLowerCase() === 'content-type'
    });

    //1. if there is no contentTypeHeader, but there should be
    if (!foundHeader && contentType !== '') {
      this.addContentTypeHeader(contentType);
    }
    //2. if there is a contentTypeHeader, but there SHOULDNT be
    else if (foundHeader && contentType === '') {
      this.removeContentTypeHeader();
    }
    //3. if there is a contentTypeHeader, needs to update
    else if (foundHeader && foundHeader.value !== contentType) {
      this.updateContentTypeHeader(contentType, foundHeader);
    }
    
  }

  addContentTypeHeader (contentType){
    let headersDeepCopy = JSON.parse(JSON.stringify(this.props.newRequestHeaders.headersArr));

    headersDeepCopy.unshift({
      id : this.props.newRequestHeaders.count,
      active : true,
      key : 'content-type',
      value : contentType,
    })
    
    this.props.setNewRequestHeaders({
      headersArr : headersDeepCopy,
      count : headersDeepCopy.length,
    });
  }

  removeContentTypeHeader (){
    let filtered = this.props.newRequestHeaders.headersArr.filter(header => {
      return header.key !== 'content-type';
    });

    this.props.setNewRequestHeaders({
      headersArr : filtered,
      count : filtered.length,
    });
  }

  updateContentTypeHeader (contentType, foundHeader) {
    let filtered = this.props.newRequestHeaders.headersArr.filter(header => {
      return header.key !== 'content-type';
    });

    filtered.unshift({
      id : this.props.newRequestHeaders.count,
      active : true,
      key : 'content-type',
      value : contentType,
    })

    this.props.setNewRequestHeaders({
      headersArr : filtered,
      count : filtered.length,
    });
  }
  

  addHeader (headersDeepCopy) {
    headersDeepCopy.push({
      id : this.props.newRequestHeaders.count,
      active : false,
      key : '',
      value : ''
    })

    this.props.setNewRequestHeaders({
      headersArr : headersDeepCopy,
      override : false,
      count : headersDeepCopy.length,
    });
  }

  onChangeUpdateHeader(id, field, value) {
    let headersDeepCopy = JSON.parse(JSON.stringify(this.props.newRequestHeaders.headersArr));

    //find header to update
    let indexToBeUpdated = undefined;
    for(let i = 0; i < headersDeepCopy.length; i++) {
      if (headersDeepCopy[i].id === id) {
        indexToBeUpdated = i;
        break;
      }
    }
    //update
    headersDeepCopy[indexToBeUpdated][field] = value;

    //also switch checkbox if they are typing
    if(field === 'key' || field === 'value') {
      headersDeepCopy[indexToBeUpdated].active = true;
    }
    
    //determine if new header needs to be added
    let emptyHeadersCount = headersDeepCopy.map(header => {
      return (!header.key && !header.value) ? 1 : 0
    }).reduce((acc, cur) => {
      return acc + cur;
    });

    //depending on if headers is empty, update store, or first add a new header
    if (emptyHeadersCount === 0) {
      this.addHeader(headersDeepCopy);
    } 
    else {
      this.props.setNewRequestHeaders({
        headersArr : headersDeepCopy,
        count : headersDeepCopy.length,
      });
    }
  }

  render() {
    // console.log('HeaderEntryForm Begin Render', this.state.headers);
    let headersArr = this.props.newRequestHeaders.headersArr.map((header, index) => {
      return (<Header content={header} changeHandler={this.onChangeUpdateHeader} key={index} Key={header.key} value={header.value}></Header>)
    });
    
    return(
      <div style={this.props.stylesObj}>
        {headersArr}
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderEntryForm);