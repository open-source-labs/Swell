import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions/actions';
import ResponseSSE from '../display/ResponseSSE.jsx';

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
    }

    let headersArr = [];
    let index = 0;
    if(this.props.content.headers){
      for (let header in this.props.content.headers) {
        headersArr.push(<div style={{'display' : 'flex'}} key={index}>
          <div style={{'width' : '50%'}}>{header}</div>
          <div style={{'width' : '50%'}}>{this.props.content.headers[header]}</div>
        </div>);
        index++;
      }
    }
   
    return(
      <div style={{'border' : '1px solid black', 'margin' : '3px', 'display' : 'flex', 'flexDirection' : 'column'}}>
        ResponseContainer
        {headersArr}
        {responseContents}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResponseContainer);