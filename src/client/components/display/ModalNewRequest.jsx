import React, { Component } from 'react';
import { connect } from 'react-redux';
import Request from './Request.jsx';
import Response from './Response.jsx';

import * as actions from '../../actions/actions';

const mapStateToProps = store => ({
 
});

const mapDispatchToProps = dispatch => ({
  reqResAdd : (reqRes) => {
    dispatch(actions.reqResAdd(reqRes));
  }
});

class ModalNewRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      method : '',
      headers : '',
      body : '',
      url : '',
    }
    this.methodOnChange = this.methodOnChange.bind(this);
    this.headersOnChange = this.headersOnChange.bind(this);
    this.bodyOnChange = this.bodyOnChange.bind(this);
    this.urlOnChange = this.urlOnChange.bind(this);
    this.addNewRequest = this.addNewRequest.bind(this);
  }

  methodOnChange (e) {
    this.setState({
      method : e.target.value,
    })
  }
  urlOnChange (e) {
    this.setState({
      url : e.target.value,
    })
  }
  headersOnChange (e) {
    this.setState({
      headers : e.target.value,
    })
  }
  bodyOnChange (e) {
    this.setState({
      body : e.target.value,
    })
  }

  addNewRequest() {
    let reqRes = {
      id : Math.random() * 100000,
      url : this.state.url,
      timeSent : null,
      timeReceived : null,
      request: {
        method : this.state.method,
        headers : JSON.parse(this.state.headers),
        body : JSON.parse(this.state.body),
      },
      response : {
        headers : null,
        data : null,
        type : null,
      }
    }

    this.props.reqResAdd(reqRes);
  }

  render() {
    console.log(this.state);
    return(
      <div style={{'border' : '1px solid black', 'display' : 'flex', 'flexDirection' : 'column'}}>
        ModalNewRequest
        <input type='text' placeholder='Method' onChange={(e) => {
          this.methodOnChange(e)
        }}></input>
        <input type='text' placeholder='URL' onChange={(e) => {
          this.urlOnChange(e)
        }}></input>
        <textarea type='text' placeholder='Headers' onChange={(e) => {
          this.headersOnChange(e)
        }}></textarea>
        <textarea type='text' placeholder='Body' onChange={(e) => {
          this.bodyOnChange(e)
        }}></textarea>
        <button onClick={this.addNewRequest}>Add New Request</button>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalNewRequest);