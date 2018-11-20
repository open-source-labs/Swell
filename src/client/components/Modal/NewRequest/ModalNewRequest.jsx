import React, { Component } from "react";
import { connect } from "react-redux";

import * as actions from '../../../actions/actions';
import HeaderEntryForm from './HeaderEntryForm.jsx';
import BodyEntryForm from "./BodyEntryForm.jsx";

const mapStateToProps = store => ({
  newResponseFields : store.business.newResponseFields
});

const mapDispatchToProps = dispatch => ({
  reqResAdd: (reqRes) => {
    dispatch(actions.reqResAdd(reqRes));
  },
  setWarningModalMessage : (message) => {
    dispatch(actions.setWarningModalMessage(message));
  },
  setModalDisplay : (modalDisplay) => {
    dispatch(actions.setModalDisplay(modalDisplay));
  },
  setNewResponseFields : (responseObj) => {
    dispatch(actions.setNewResponseFields(responseObj));
  }
});

class ModalNewRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      method : 'GET',
      protocol : 'http://',
      headers : [],
      contentTypeHeader: "",
      body : {},
      url : 'http://',
      JSONProperlyFormatted : false,
    };

    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.updateHeaders = this.updateHeaders.bind(this);
    this.updateBody = this.updateBody.bind(this);
    this.updateContentTypeHeader = this .updateContentTypeHeader.bind(this);
    this.addNewRequest = this.addNewRequest.bind(this);
  }

  componentDidMount () {
    this.setState(this.props.newResponseFields)
  }

  componentDidUpdate () {
    if(JSON.stringify(this.state) !== JSON.stringify(this.props.newResponseFields)){
      this.props.setNewResponseFields(this.state);
    }
  
    if (this.state.method === 'GET' && this.state.contentTypeHeader != '') {
      this.setState({
        contentTypeHeader : '',
      })
    }
    if (this.state.contentTypeHeader === 'application/json') {
      try {
        let tryParse = JSON.parse(this.state.body);
        if(this.state.JSONProperlyFormatted !== true){
          this.setState({
            JSONProperlyFormatted : true,
          })
        }
      }
      catch(error) {
        if(this.state.JSONProperlyFormatted !== false){
          this.setState({
            JSONProperlyFormatted : false,
          })
        }
      }
    }
  }

  onChangeHandler(e, property) {
    this.setState({
      [property]: property === 'url' ? this.state.protocol + e.target.value.replace(/h?t?t?p?s?:\/?\/?/, '') : e.target.value
    }, () => {
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
    if (this.state.body !== body){
      this.setState({
        body,
      });
    }
  }
  updateContentTypeHeader (header) {
    this.setState({
      contentTypeHeader : header
    });
  }

  requestValidationCheck () {
    let validationMessage = undefined;

    console.log(this.state.url)
    //Error conditions...
    if(this.state.url === 'http://' || this.state.url === 'https://') {
      validationMessage = "Please enter a valid URL.";
    }
    if (!this.state.JSONProperlyFormatted && this.state.contentTypeHeader === 'application/json'){
      validationMessage = "Please fix JSON body formatting errors.";
    }
    return validationMessage ? validationMessage : true;
  }

  addNewRequest() {
    let validated = this.requestValidationCheck();

    if (validated === true) {
      let reqRes = {
        id : Math.floor(Math.random() * 100000),
        // url: 'http://localhost:80/events',
        url : this.state.url,
        timeSent : null,
        timeReceived : null,
        connection : 'uninitialized',
        connectionType : null,
        checkSelected : false,
        request: {
          method : this.state.method,
          headers : this.state.headers,
          body : JSON.stringify(this.state.body)
        },
        response : {
          headers : null,
          events : null,
        },
        checked : false,
      };

      this.props.reqResAdd(reqRes);
      this.setState({
        method : 'GET',
        protocol : 'http://',
        headers : [],
        contentTypeHeader: "",
        body : {},
        url : 'http://',
        JSONProperlyFormatted : false,
      });
    } 
    else {
      this.props.setWarningModalMessage(validated);
      this.props.setModalDisplay('Warning');
    }
  }

  render() {
    return(
      <div style={{'border' : '1px solid black', 'display' : 'flex', 'flexDirection' : 'column'}} onKeyPress={event => {
        if (event.key === 'Enter') {
          this.addNewRequest();
        }
      }}>
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
        
        <HeaderEntryForm updateHeaders={this.updateHeaders} contentTypeHeader={this.state.contentTypeHeader}></HeaderEntryForm>
        
        <BodyEntryForm method={this.state.method} updateBody={this.updateBody} updateContentTypeHeader={this.updateContentTypeHeader} contentTypeHeader={this.state.contentTypeHeader} bodyContent={this.state.body} ></BodyEntryForm>

        <button onClick={this.addNewRequest}>Add New Request</button>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalNewRequest);
