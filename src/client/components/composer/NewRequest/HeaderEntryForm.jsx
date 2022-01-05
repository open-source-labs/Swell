/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-no-duplicate-props */
import React, { Component } from 'react';
import ContentReqRowComposer from './ContentReqRowComposer';


class HeaderEntryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
    };
    this.onChangeUpdateHeader = this.onChangeUpdateHeader.bind(this);
    this.toggleShow = this.toggleShow.bind(this);
    this.deleteHeader = this.deleteHeader.bind(this);
  }

  componentDidUpdate() {
    const headersDeepCopy = JSON.parse(
      JSON.stringify(this.props.newRequestHeaders.headersArr)
    );
    const lastHeader = headersDeepCopy[headersDeepCopy.length - 1];
    if (
      lastHeader?.key !== '' &&
      lastHeader?.key.toLowerCase() !== 'content-type'
    ) {
      this.addHeader();
    }
    this.checkContentTypeHeaderUpdate();
  }

  contentHeaderNeeded() {
    const { method } = this.props.newRequestFields;
    return (
      method === 'PUT' ||
      method === 'PATCH' ||
      method === 'DELETE' ||
      method === 'POST' ||
      this.props.newRequestBody.bodyType === 'GQL' ||
      this.props.newRequestBody.bodyType === 'GQLvariables'
    );
  }

  checkContentTypeHeaderUpdate() {
    let contentType;

    if (
      this.props.newRequestBody.bodyType === 'GRPC' ||
      this.props.newRequestBody.bodyType === 'none'
    ) {
      contentType = '';
    } else if (this.props.newRequestBody.bodyType === 'x-www-form-urlencoded') {
      contentType = 'x-www-form-urlencoded';
    } else if (
      this.props.newRequestBody.bodyType === 'GQL' ||
      this.props.newRequestBody.bodyType === 'GQLvariables'
    ) {
      contentType = 'application/json';
    } else {
      contentType = this.props.newRequestBody.rawType;
    }

    // Attempt to update header in these conditions:
    const foundHeader = this.props.newRequestHeaders.headersArr.find((header) =>
      header.key.toLowerCase().includes('content-type')
    );

    // 1. if there is no contentTypeHeader, but there should be
    if (!foundHeader && contentType !== '' && this.contentHeaderNeeded()) {
      this.addContentTypeHeader(contentType);
      // this.updateContentTypeHeader(contentType, foundHeader);
    }
    // 2. if there is a contentTypeHeader, but there SHOULDNT be, but the user inputs anyway... just let them
    else if (foundHeader && contentType === '') {
      //keeping this else if lets the user do what they want, it's fine, updateContentTypeHeader and removeContentTypeHeader will fix it later
    }
    // 3. if there is a contentTypeHeader, needs to update
    // else if (
    //   foundHeader &&
    //   foundHeader.value !== contentType &&
    //   this.contentHeaderNeeded()
    // ) {
    //   this.updateContentTypeHeader(contentType, foundHeader);
    // }
  }

  addContentTypeHeader(contentType) {
    if (!this.contentHeaderNeeded()) return;
    const headersDeepCopy = JSON.parse(
      JSON.stringify(
        this.props.newRequestHeaders.headersArr.filter(
          (header) => header.key.toLowerCase() !== 'content-type'
        )
      )
    );
    const contentTypeHeader = {
      id: Math.random() * 1000000,
      active: true,
      key: 'Content-Type',
      value: contentType,
    };
    headersDeepCopy.unshift(contentTypeHeader);
    this.props.setNewRequestHeaders({
      headersArr: headersDeepCopy,
      count: headersDeepCopy.length,
    });
  }

  updateContentTypeHeader(contentType, foundHeader) {
    const filtered = this.props.newRequestHeaders.headersArr.filter(
      (header) => !header.key.toLowerCase().includes('content-type')
    );

    this.props.setNewRequestHeaders({
      headersArr: filtered,
      count: filtered.length,
    });
  }

  addHeader() {
    const headersDeepCopy = JSON.parse(
      JSON.stringify(this.props.newRequestHeaders.headersArr)
    );
    headersDeepCopy.push({
      id: Math.random() * 1000000,
      active: false,
      key: '',
      value: '',
    });

    this.props.setNewRequestHeaders({
      headersArr: headersDeepCopy,
      override: false,
      count: headersDeepCopy.length,
    });
  }

  onChangeUpdateHeader(id, field, value) {
    const headersDeepCopy = JSON.parse(
      JSON.stringify(this.props.newRequestHeaders.headersArr)
    );
    // find header to update
    let indexToBeUpdated;
    for (let i = 0; i < headersDeepCopy.length; i += 1) {
      if (headersDeepCopy[i].id === id) {
        indexToBeUpdated = i;
        break;
      }
    }
    // if it's the content-type header, just exit
    const isFirst = indexToBeUpdated === 0;
    // if (isFirst) return;

    // update
    headersDeepCopy[indexToBeUpdated][field] = value;

    // also switch checkbox if they are typing
    if (field === 'key' || field === 'value') {
      headersDeepCopy[indexToBeUpdated].active = true;
    }

    this.props.setNewRequestHeaders({
      headersArr: headersDeepCopy,
      count: headersDeepCopy.length,
    });
  }

  toggleShow() {
    this.setState({
      show: !this.state.show,
    });
  }

  deleteHeader(index) {
    const newHeadersArr = this.props.newRequestHeaders.headersArr.slice();
    newHeadersArr.splice(index, 1);
    this.props.setNewRequestHeaders({
      headersArr: newHeadersArr,
      count: newHeadersArr.length,
    });
  }
  
  render() {
    let headerName = 'Headers';
    let addHeaderName = '+';
    // let headerClass = 'composer_submit http'
    if (this.props.newRequestFields.gRPC) {
      headerName = 'Metadata';
      addHeaderName = '+ Metadata';
    }

    const headersArr = this.props.newRequestHeaders.headersArr.map(
      (header, index) => (
        <ContentReqRowComposer
          data={header}
          index={index}
          type="header-row"
          deleteItem={this.deleteHeader}
          changeHandler={this.onChangeUpdateHeader}
          key={index} //key
        />
      )
    );

    return (
      <div className="mt-2"
      style={{margin: '10px'}}>
        <div className="is-flex is-align-content-center">
          <div className="composer-section-title">{headerName}</div>
          <button
            className={`${this.props.isDark ? 'is-dark-200' : ''} button is-small add-header-or-cookie-button`}
            style={{height: '5px', width: '5px'}}
            onClick={() => this.addHeader()}
          >
            {addHeaderName}
          </button>
        </div>
        <div>{headersArr}</div>
      </div>
    );
  }
}

export default HeaderEntryForm;



// is-justify-content-space-between