import React, { Component } from "react";
import { connect } from "react-redux";
import Request from "./Request.jsx";
import Response from "./Response.jsx";

<<<<<<< HEAD
import * as actions from "../../actions/actions";
=======
import * as actions from '../../actions/actions';
import HeaderEntryForm from './HeaderEntryForm.jsx';
>>>>>>> dev

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
<<<<<<< HEAD
      method: "",
      headers: "",
      body: "",
      url: ""
    };
=======
      method : 'GET',
      headers : [],
      body : '',
      url : '',
    }
>>>>>>> dev
    this.methodOnChange = this.methodOnChange.bind(this);
    this.updateHeaders = this.updateHeaders.bind(this);
    this.bodyOnChange = this.bodyOnChange.bind(this);
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
<<<<<<< HEAD
  headersOnChange(e) {
    this.setState({
      headers: e.target.value
=======
  updateHeaders (headers) {
    console.log('UPDATE HEADERS CALLED', headers);
    this.setState({
      headers: headers.filter(header => {
        return header.active;
      }),
    },() => {
      console.log(this.state.headers)
>>>>>>> dev
    });
  }
  bodyOnChange(e) {
    this.setState({
      body: e.target.value
    });
  }

  addNewRequest() {
    console.log(this.state.headers)
    let reqRes = {
<<<<<<< HEAD
      id: Math.random() * 100000,
      url: this.state.url,
      timeSent: null,
      timeReceived: null,
      request: {
        method: this.state.method,
        headers: JSON.parse(this.state.headers),
        body: JSON.parse(this.state.body)
      },
      response: {
        headers: null,
        data: null,
        type: null
=======
      id : Math.floor(Math.random() * 100000),
      url : this.state.url,
      timeSent : null,
      timeReceived : null,
      connection : 'uninitialized',
      connectionType : null,
      request: {
        method : this.state.method,
        headers : this.state.headers,
        body : JSON.parse(this.state.body),
      },
      response : {
        headers : null,
        events : null,
>>>>>>> dev
      }
    };

    this.props.reqResAdd(reqRes);
  }

  render() {
<<<<<<< HEAD
    console.log(this.state);
    return (
      <div
        style={{
          border: "1px solid black",
          display: "flex",
          flexDirection: "column"
        }}
      >
        ModalNewRequest
        <input
          type="text"
          placeholder="Method"
          onChange={e => {
            this.methodOnChange(e);
          }}
        />
        <input
          type="text"
          placeholder="URL"
          onChange={e => {
            this.urlOnChange(e);
          }}
        />
        <textarea
          type="text"
          placeholder="Headers"
          onChange={e => {
            this.headersOnChange(e);
          }}
        />
        <textarea
          type="text"
          placeholder="Body"
          onChange={e => {
            this.bodyOnChange(e);
          }}
        />
=======
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
        
        <HeaderEntryForm updateHeaders={this.updateHeaders}></HeaderEntryForm>

        <textarea type='text' placeholder='Body' onChange={(e) => {
          this.bodyOnChange(e)
        }}></textarea>

>>>>>>> dev
        <button onClick={this.addNewRequest}>Add New Request</button>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalNewRequest);
