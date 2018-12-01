/* eslint-disable react/jsx-no-duplicate-props */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions/actions';
import Header from './Header.jsx';

const mapStateToProps = store => ({
  newRequestHeaders: store.business.newRequestHeaders,
  newRequestBody: store.business.newRequestBody,
});

const mapDispatchToProps = dispatch => ({
  setNewRequestHeaders: (requestHeadersObj) => {
    dispatch(actions.setNewRequestHeaders(requestHeadersObj));
  },
});

class HeaderEntryForm extends Component {
  constructor(props) {
    super(props);
    this.onChangeUpdateHeader = this.onChangeUpdateHeader.bind(this);
  }

  componentDidMount() {
    // console.log(this.props);
    const headersDeepCopy = JSON.parse(JSON.stringify(this.props.newRequestHeaders.headersArr));
    this.addHeader(headersDeepCopy);
  }

  componentDidUpdate() {
    if (this.props.newRequestHeaders.headersArr.length === 0) {
      const headersDeepCopy = JSON.parse(JSON.stringify(this.props.newRequestHeaders.headersArr));
      this.addHeader(headersDeepCopy);
    }
    this.checkContentTypeHeaderUpdate();
  }

  checkContentTypeHeaderUpdate() {
    let contentType;
    if (this.props.newRequestBody.bodyType === 'none') {
      contentType = '';
    }
    else if (this.props.newRequestBody.bodyType === 'x-www-form-urlencoded') {
      contentType = 'x-www-form-urlencoded';
    }
    else {
      contentType = this.props.newRequestBody.rawType;
    }

    // Attempt to update header in these conditions:
    const foundHeader = this.props.newRequestHeaders.headersArr.find(header => header.key.toLowerCase() === 'content-type');

    // 1. if there is no contentTypeHeader, but there should be
    if (!foundHeader && contentType !== '') {
      this.addContentTypeHeader(contentType);
    }
    // 2. if there is a contentTypeHeader, but there SHOULDNT be
    else if (foundHeader && contentType === '') {
      this.removeContentTypeHeader();
    }
    // 3. if there is a contentTypeHeader, needs to update
    else if (foundHeader && foundHeader.value !== contentType) {
      this.updateContentTypeHeader(contentType, foundHeader);
    }
  }

  addContentTypeHeader(contentType) {
    const headersDeepCopy = JSON.parse(JSON.stringify(this.props.newRequestHeaders.headersArr));

    headersDeepCopy.unshift({
      id: this.props.newRequestHeaders.count,
      active: true,
      key: 'content-type',
      value: contentType,
    });

    this.props.setNewRequestHeaders({
      headersArr: headersDeepCopy,
      count: headersDeepCopy.length,
    });
  }

  removeContentTypeHeader() {
    const filtered = this.props.newRequestHeaders.headersArr.filter(header => header.key !== 'content-type');

    this.props.setNewRequestHeaders({
      headersArr: filtered,
      count: filtered.length,
    });
  }

  updateContentTypeHeader(contentType, foundHeader) {
    const filtered = this.props.newRequestHeaders.headersArr.filter(header => header.key !== 'content-type');

    filtered.unshift({
      id: this.props.newRequestHeaders.count,
      active: true,
      key: 'content-type',
      value: contentType,
    });

    this.props.setNewRequestHeaders({
      headersArr: filtered,
      count: filtered.length,
    });
  }

  addHeader(headersDeepCopy) {
    headersDeepCopy.push({
      id: this.props.newRequestHeaders.count,
      active: false,
      key: '',
      value: '',
    });

    // console.log(headersDeepCopy);

    this.props.setNewRequestHeaders({
      headersArr: headersDeepCopy,
      override: false,
      count: headersDeepCopy.length,
    });
  }

  onChangeUpdateHeader(id, field, value) {
    const headersDeepCopy = JSON.parse(JSON.stringify(this.props.newRequestHeaders.headersArr));

    // find header to update
    let indexToBeUpdated;
    for (let i = 0; i < headersDeepCopy.length; i += 1) {
      if (headersDeepCopy[i].id === id) {
        indexToBeUpdated = i;
        break;
      }
    }
    // update
    headersDeepCopy[indexToBeUpdated][field] = value;

    // also switch checkbox if they are typing
    if (field === 'key' || field === 'value') {
      headersDeepCopy[indexToBeUpdated].active = true;
    }

    // determine if new header needs to be added
    const emptyHeadersCount = headersDeepCopy
      .map(header => (!header.key && !header.value ? 1 : 0))
      .reduce((acc, cur) => acc + cur);

    // depending on if headers is empty, update store, or first add a new header
    if (emptyHeadersCount === 0) {
      this.addHeader(headersDeepCopy);
    }
    else {
      this.props.setNewRequestHeaders({
        headersArr: headersDeepCopy,
        count: headersDeepCopy.length,
      });
    }
  }

  render() {
    // console.log('HeaderEntryForm Begin Render', this.state.headers);
    const headersArr = this.props.newRequestHeaders.headersArr.map((header, index) => (
      <Header
        content={header}
        changeHandler={this.onChangeUpdateHeader}
        key={index}
        Key={header.key}
        value={header.value}
      />
    ));

    return <div style={this.props.stylesObj}>{headersArr}</div>;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HeaderEntryForm);
