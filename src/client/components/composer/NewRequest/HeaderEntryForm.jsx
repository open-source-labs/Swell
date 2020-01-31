/* eslint-disable react/jsx-no-duplicate-props */
import React, { Component } from 'react';
import Header from './Header.jsx';
import dropDownArrow from '../../../../assets/icons/arrow_drop_down_white_192x192.png'

class HeaderEntryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
    }
    this.onChangeUpdateHeader = this.onChangeUpdateHeader.bind(this);
    this.toggleShow = this.toggleShow.bind(this);
  }

  componentDidMount() {
    const headersDeepCopy = JSON.parse(JSON.stringify(this.props.newRequestHeaders.headersArr));
    // if (headersDeepCopy[headersDeepCopy.length - 1] && headersDeepCopy[headersDeepCopy.length - 1].key !== "") this.addHeader(headersDeepCopy);
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
    console.log(this.props.newRequestBody.bodyType)

    if (this.props.newRequestBody.bodyType === 'GRPC') {
      contentType = ''
    }

    else if (this.props.newRequestBody.bodyType === 'none') {
      contentType = '';
    }
    else if (this.props.newRequestBody.bodyType === 'x-www-form-urlencoded') {
      contentType = 'x-www-form-urlencoded';
    }
    else if (this.props.newRequestBody.bodyType === 'GQL' || this.props.newRequestBody.bodyType === 'GQLvariables') {
      contentType = 'application/json'
    }
    else {
      contentType = this.props.newRequestBody.rawType;
    }

    // Attempt to update header in these conditions:
    const foundHeader = this.props.newRequestHeaders.headersArr.find(header => /content-type$/i.test(header.key.toLowerCase()));

    // 1. if there is no contentTypeHeader, but there should be
    if (!foundHeader && contentType !== '') {
      this.addContentTypeHeader(contentType);
      // this.updateContentTypeHeader(contentType, foundHeader);
    }
    // 2. if there is a contentTypeHeader, but there SHOULDNT be, but the user inputs anyway... just let them
    else if (foundHeader && contentType === '') {
      //keeping this else if lets the user do what they want, it's fine, updateContentTypeHeader and removeContentTypeHeader will fix it later
    }
    // 3. if there is a contentTypeHeader, needs to update
    else if (foundHeader && foundHeader.value !== contentType) {
      this.updateContentTypeHeader(contentType, foundHeader);
    }
  }

  addContentTypeHeader(contentType) {
    const headersDeepCopy = JSON.parse(JSON.stringify(this.props.newRequestHeaders.headersArr.filter(header => header.key.toLowerCase() !== 'content-type')));

    const contentTypeHeader = ({
      id: this.props.newRequestHeaders.headersArr.length,
      active: true,
      key: 'Content-Type',
      value: contentType,
    });
    //headersDeepCopy.length > 1 ? headersDeepCopy.splice(headersDeepCopy.length - 1, 0, contentTypeHeader) : headersDeepCopy.unshift(contentTypeHeader)
    headersDeepCopy.push(contentTypeHeader)
    this.props.setNewRequestHeaders({
      headersArr: headersDeepCopy,
      count: headersDeepCopy.length,
    });
  }

  updateContentTypeHeader(contentType) {
    const filtered = this.props.newRequestHeaders.headersArr.filter(header => header.key.toLowerCase() !== 'content-type');
    this.props.newRequestHeaders.headersArr.push({
      id: this.props.newRequestHeaders.headersArr.length,
      active: true,
      key: 'Content-Type',
      value: contentType,
    });

    this.props.setNewRequestHeaders({
      headersArr: filtered,
      count: filtered.length,
    });
  }

  addHeader() {
    const headersDeepCopy = JSON.parse(JSON.stringify(this.props.newRequestHeaders.headersArr));
    console.log(headersDeepCopy);
    headersDeepCopy.push({
      id: this.props.newRequestHeaders.headersArr.length,
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

    const headersDeepCopy = JSON.parse(JSON.stringify(this.props.newRequestHeaders.headersArr));
    // find header to update
    let indexToBeUpdated;
    for (let i = 0; i < headersDeepCopy.length; i += 1) {
      if (headersDeepCopy[i].id === id) {
        console.log('updating this one: ', i)
        indexToBeUpdated = i;

      }
    }
    // update
    headersDeepCopy[indexToBeUpdated][field] = value;

    // also switch checkbox if they are typing
    if (field === 'key' || field === 'value') {
      headersDeepCopy[indexToBeUpdated].active = true;
    }

    // determine if new header needs to be added
    // const emptyHeadersCount = headersDeepCopy
    //   .reduce((count, curr) => {
    //     if (!curr.key && !curr.value)++count
    //     return count
    //   }, 0)

    // depending on if headers is empty, update store, or first add a new header
    // if (emptyHeadersCount === 0) {
    //   this.addHeader(headersDeepCopy);
    // }

    this.props.setNewRequestHeaders({
      headersArr: headersDeepCopy,
      count: headersDeepCopy.length,
    });

  }

  toggleShow() {
    this.setState({
      show: !this.state.show
    });
  }

  render() {
    let headerName = 'Headers';
    let addHeaderName = 'Add Header'
    let headerClass = 'composer_submit http'
    if (this.props.newRequestBody.bodyType === 'GRPC') {
      headerName = 'Metadata';
      addHeaderName = 'Add Metadata';
      headerClass = 'import-proto'
    }
    if (this.props.newRequestBody.bodyType === 'GQL') {
      headerClass = 'composer_submit gql'
    }

    const headersArr = this.props.newRequestHeaders.headersArr.map((header, index) => (
      <Header
        content={header}
        changeHandler={this.onChangeUpdateHeader}
        key={index} //key
        Key={header.key} //prop
        value={header.value}
      />
    ));

    const arrowClass = this.state.show ? 'composer_subtitle_arrow-closed' : 'composer_subtitle_arrow-open';
    const headersContainerClass = this.state.show ? 'composer_headers_container-closed' : 'composer_headers_container-open'

    return <div style={this.props.stylesObj}>
      <div
        title="Add Request Headers"
        className='composer_subtitle' onClick={this.toggleShow} style={this.props.stylesObj}>
        <img className={arrowClass} src={dropDownArrow}>
        </img>
        {headerName}
      </div>
      <div className={headersContainerClass} >
        {headersArr}
        <button onClick={() => this.addHeader()} className={headerClass}> {addHeaderName} </button>

      </div>
    </div>;
  }
}

export default HeaderEntryForm;
