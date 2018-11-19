import React, { Component } from "react";
import { connect } from "react-redux";

import * as actions from '../../actions/actions';
import HeaderEntryForm from './HeaderEntryForm.jsx';
import BodyEntryForm from "./BodyEntryForm.jsx";

const mapStateToProps = store => ({});

const mapDispatchToProps = dispatch => ({
  reqResAdd: reqRes => {
    dispatch(actions.reqResAdd(reqRes));
  }
});

class ModalNewRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      method : 'GET',
      headers : [],
      contentTypeHeader: undefined,
      body : {},
      url : '',
    };
    this.methodOnChange = this.methodOnChange.bind(this);
    this.updateHeaders = this.updateHeaders.bind(this);
    this.updateBody = this.updateBody.bind(this);
    this.updateContentTypeHeader = this .updateContentTypeHeader.bind(this);
    this.urlOnChange = this.urlOnChange.bind(this);
    this.addNewRequest = this.addNewRequest.bind(this);
  }

  methodOnChange(e) {
    this.setState({
      method: e.target.value
    });
  }
  urlOnChange(e) {
    this.setState({
      url: e.target.value
    });
  }
  updateHeaders (headers) {
    this.setState({
      headers: headers.filter(header => {
        return header.active;
      }),
    },() => {
    });
  }
  updateBody (body) {
    this.setState({
      body: body,
    });
  }
  updateContentTypeHeader (header) {
    this.setState({
      contentTypeHeader : header
    });
  }
  addNewRequest() {
    let reqRes = {
      id : Math.floor(Math.random() * 100000),
      // url: 'http://localhost:80/events',
      url : this.state.url,
      timeSent : null,
      timeReceived : null,
      connection : 'uninitialized',
      connectionType : null,
      request: {
        method : this.state.method,
        headers : this.state.headers,
        body : this.state.body,
      },
      response : {
        headers : null,
        events : null,
      },
    };
    this.props.reqResAdd(reqRes);
  }

  render() {
    return(
      <div style={{'border' : '1px solid black', 'display' : 'flex', 'flexDirection' : 'column'}}>
        ModalNewRequest
        <select onChange={(e) => {
          this.methodOnChange(e)
        }}>
          <option value='GET'>GET</option>
          <option value='POST'>POST</option>
          <option value='PUT'>PUT</option>
          <option value='PATCH'>PATCH</option>
          <option value='DELETE'>DELETE</option>
        </select>

        <input type='text' placeholder='URL' onChange={(e) => {
          this.urlOnChange(e)
        }}></input>

         {/* value={'http://localhost:8080/sse'}  */}
        
        <HeaderEntryForm updateHeaders={this.updateHeaders} contentTypeHeader={this.state.contentTypeHeader}></HeaderEntryForm>
        
        <BodyEntryForm method={this.state.method} updateBody={this.updateBody} updateContentTypeHeader={this.updateContentTypeHeader}></BodyEntryForm>

        <button onClick={this.addNewRequest}>Add New Request</button>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalNewRequest);
