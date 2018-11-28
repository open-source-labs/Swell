import React, { Component } from "react";
import { connect } from "react-redux";

import * as actions from '../../../actions/actions';
import HeaderEntryForm from './HeaderEntryForm.jsx';
import BodyEntryForm from "./BodyEntryForm.jsx";
import ProtocolSelect from "./ProtocolSelect.jsx";

const mapStateToProps = store => ({
  newResponseFields : store.business.newResponseFields,
  currentTab : store.business.currentTab,
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
      bodyType : 'none',
      rawType : 'Text (text/plain)',
      contentTypeHeader: "none",
      body : '',
      url : 'http://',
      JSONFormatted : true,
    };

    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.updateHeaders = this.updateHeaders.bind(this);
    this.updateBody = this.updateBody.bind(this);
    this.updateBodyType = this.updateBodyType.bind(this);
    this.updateRawType = this.updateRawType.bind(this);
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
        let tryParse = JSON.parse(JSON.stringify(this.state.body));

        if(this.state.JSONProperlyFormatted !== true){
          this.setState({
            JSONProperlyFormatted : true,
          }, () => {
          })
        }
      }
      catch(error) {
        if(this.state.JSONProperlyFormatted !== false){
          this.setState({
            JSONProperlyFormatted : false,
          }, () => {
          })
        }
      }
    }
  }

  onChangeHandler(e, property) {
    this.setState({
      [property]: property === 'url' ? this.state.protocol + e.target.value.replace(/(h?.?t?.?t?.?p?.?s?.?|w?.?s?.?)(:[^\/]?\/?.?\/?)/, '') : e.target.value
    }, () => {
      if(property === 'protocol') {
        this.setState ({
          'url' : this.state.protocol + this.state.url.replace(/(h?t?t?p?s?|w?s?):\/?\/?/, ''),
        });
      }
    }) 
  };
  
  updateBodyType(bodyType) {
    if(this.state.bodyType !== bodyType){
      this.setState({
        bodyType : bodyType,
      });
    }
  }

  updateRawType(rawType) {
    if(this.state.rawType !== rawType){
      this.setState({
        rawType : rawType,
      });
    }
  }

  updateJSONFormatted(isJSONFormatted) {
    if(this.state.JSONFormatted !== isJSONFormatted){
      this.setState({
        JSONFormatted : isJSONFormatted,
      });
    }
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
    if (this.state.body !== body){
      this.setState({
        body,
      });
    }
  }

  requestValidationCheck () {
    let validationMessage = undefined;

    //Error conditions...
    if(this.state.url === 'http://' || this.state.url === 'https://' || this.state.url === 'ws://') {
      validationMessage = "Please enter a valid URI.";
    }
    else if (!this.state.JSONProperlyFormatted && this.state.contentTypeHeader === 'application/json'){
      validationMessage = "Please fix JSON body formatting errors.";
    }
    return validationMessage ? validationMessage : true;
  }

  addNewRequest() {
    let validated = this.requestValidationCheck();

    if (validated === true) {
      let reqRes;
      //HTTP REQUESTS
      if(this.state.protocol !== 'ws://'){
        let URIWithoutProtocol = this.state.url.split(this.state.protocol)[1] + '/';
        if (URIWithoutProtocol.charAt(URIWithoutProtocol.length-1) !== '/') {
          URIWithoutProtocol = URIWithoutProtocol + '/';
        }
        let host = this.state.protocol + URIWithoutProtocol.split('/')[0];
        let path = '/' + URIWithoutProtocol.split('/').splice(1).join('/').replace(/\/{2,}/g, '/');
        if (path.charAt(path.length - 1) === '/' && path.length >1) {
          path = path.substring(0, path.length - 1);
        }
        path = path.replace(/https?:\//g,'http://')

        reqRes = {
          id : Math.floor(Math.random() * 100000),
          protocol : this.state.protocol,
          host : host,
          path : path,
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
          tab : this.props.currentTab,
        };
      }
      //WEBSOCKET REQUESTS 
      else {
        reqRes = {
          id : Math.floor(Math.random() * 100000),
          protocol : this.state.protocol,
          url : this.state.url,
          timeSent : null,
          timeReceived : null,
          connection : 'uninitialized',
          connectionType : 'WebSocket',
          checkSelected : false,
          request: {
            messages : [],
          },
          response : {
            messages : [],
          },
          checked : false,
          tab : this.props.currentTab,
        };
      }

      this.props.reqResAdd(reqRes);

      //reset state for next request
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
    // console.log(this.state);
    let HTTPMethodStyle = {
      display : this.state.protocol !== 'ws://' ? 'block' : 'none',
    }
    let HeaderEntryFormStyle = {
      display : this.state.protocol !== 'ws://' ? 'block' : 'none',
    }
    let BodyEntryFormStyle = {
      'display' : (this.state.method !== 'GET' && this.state.protocol !== 'ws://') ? 'flex' : 'none',
      'flexDirection' : 'column'
    }

    return(
      <div style={{'display' : 'flex', 'flexDirection' : 'column'}} onKeyPress={event => {
        if (event.key === 'Enter') {
          this.addNewRequest();
        }
      }}>
        <h1 className={'sidebar_title'}>Create New Request</h1>

        <ProtocolSelect currentProtocol={this.state.protocol} onChangeHandler={this.onChangeHandler}/>

        <select style={HTTPMethodStyle} value={this.state.method} className={'HTTPMethodStyle modal_select'} onChange={(e) => {
          this.onChangeHandler(e, 'method')
        }}>
          <option value='GET'>GET</option>
          <option value='POST'>POST</option>
          <option value='PUT'>PUT</option>
          <option value='PATCH'>PATCH</option>
          <option value='DELETE'>DELETE</option>
        </select>

        <input className={'modal_url-input'} type='text' placeholder='URL' value={this.state.url} onChange={(e) => {
          this.onChangeHandler(e, 'url')
        }}></input>
        
        <HeaderEntryForm stylesObj={HeaderEntryFormStyle} updateHeaders={this.updateHeaders} bodyType={this.state.bodyType} rawType={this.state.rawType}></HeaderEntryForm>
        
        <BodyEntryForm 
          stylesObj={BodyEntryFormStyle} 
          bodyContent={this.state.body}
          updateBodyContent={this.updateBody} 
          bodyType={this.state.bodyType}
          updateBodyType={this.updateBodyType}
          rawType={this.state.rawType}
          updateRawType={this.updateRawType}
          JSONFormatted={this.state.JSONFormatted}
          updateJSONFormatted={this.updateJSONFormatted}
        />

        <button className={'modal_submit'} onClick={this.addNewRequest}>Add New Request</button>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalNewRequest);
