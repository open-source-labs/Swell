import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions/actions';
import ResponseSSE from '../display/ResponseSSE.jsx';
import ResponsePlain from '../display/ResponsePlain.jsx';
import ResponseTabs from './../display/ResponseTabs.jsx';

const mapStateToProps = store => ({
 
});

const mapDispatchToProps = dispatch => ({

});

class ResponseContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  componentDidMount () {
    if(this.state.responseDisplay !== this.props.connectionType){
      this.setState({
        responseDisplay : this.props.connectionType
      })
    } 
  }

  componentDidUpdate () {
    if(this.state.responseDisplay !== this.props.connectionType){
      this.setState({
        responseDisplay : this.props.connectionType
      })
    }
  }

  render() {
    let responseContents;
    switch (this.state.responseDisplay) {
      case 'SSE' : {
        responseContents = <ResponseSSE content={this.props.content}/>
        break;
      }
      case 'plain' : {
        responseContents = <ResponsePlain content={this.props.content}/>
        break;
      }
    }

    let headersArr = [];
    let index = 0;
    
    if(this.props.content.headers){
      for (let header in this.props.content.headers) {
        headersArr.push(<div className={'headers nested-grid-2'} key={index}>
          <div><span className={'tertiary-title'}>{header}</span></div>
          <div><span className={'tertiary-title'}>{this.props.content.headers[header]}</span></div>
        </div>);
        index++;
      }
    }
   
    return(
      <div className={'resreq_res-container'}>
        {/* ResponseContainer */}
        <ResponseTabs responseContent={this.props.content}/>
        {/* <div>{responseContents}</div>
        <span className={'secondary-title highlighter'}>Events</span>

        <div>{headersArr}</div>
        <span className={'secondary-title highlighter'}>Headers</span> */}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResponseContainer);