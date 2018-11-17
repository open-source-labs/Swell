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
      protocol : 'http://',
      headers : [],
      contentTypeHeader: undefined,
      body : {},
      url : 'http://',
    };

    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.updateHeaders = this.updateHeaders.bind(this);
    this.updateBody = this.updateBody.bind(this);
    this.updateContentTypeHeader = this .updateContentTypeHeader.bind(this);
    this.addNewRequest = this.addNewRequest.bind(this);
  }

  componentDidUpdate () {
    if (this.state.method === 'GET' && this.state.contentTypeHeader != undefined) {
      this.setState({
        contentTypeHeader : undefined,
      })
    }
  }

  onChangeHandler(e, property) {
    this.setState({
      [property]: property === 'url' ? this.state.protocol + e.target.value.replace(/h?t?t?p?s?:\/?\/?/, '') : e.target.value
    }, () => {
      console.log(property);
      if(property === 'protocol') {
        this.setState ({
          'url' : this.state.protocol + this.state.url.replace(/h?t?t?p?s?:\/?\/?/, ''),
        });
      }
    }) 
  };
  


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
    console.log(this.state);
    return(
      <div style={{'border' : '1px solid black', 'display' : 'flex', 'flexDirection' : 'column'}}>
        ModalNewRequest
        <div onChange={(e) => {
          this.onChangeHandler(e, 'protocol')
        }}>
          <input name='protocol' type='radio' value='http://' defaultChecked={true}></input>HTTP
          <input name='protocol' type='radio' value='https://'></input>HTTPS
        </div>

        <select onChange={(e) => {
          this.onChangeHandler(e, 'method')
        }}>
          <option value='GET'>GET</option>
          <option value='POST'>POST</option>
          <option value='PUT'>PUT</option>
          <option value='PATCH'>PATCH</option>
          <option value='DELETE'>DELETE</option>
        </select>

        <input type='text' placeholder='URL' value={this.state.url} onChange={(e) => {
          this.onChangeHandler(e, 'url')
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
