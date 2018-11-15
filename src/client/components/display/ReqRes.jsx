import React, { Component } from "react";
import { connect } from 'react-redux';
import Request from './Request.jsx';
import Response from './Response.jsx';
import ReqResCtrl from '../ReqResCtrl';

import * as actions from '../../actions/actions';

const mapStateToProps = store => ({
 
});

const mapDispatchToProps = dispatch => ({

});

class ReqRes extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.setState({
      abortController : new AbortController(),
    })
  }

  render() {
    let contentBody = [];
    contentBody.push(<Request content={this.props.content.request} key={0}/>);
    if (this.props.content.connection !== 'uninitialized') {
      contentBody.push(<Response content={this.props.content.response} key={1}/>)
    };

    return(
      <div style={{'border' : '1px solid black', 'margin' : '3px', 'display' : 'flex', 'flexDirection' : 'column'}}>
        {this.props.content.id}
        {this.props.content.url}
        {this.props.content.timeSent}
        {this.props.content.timeReceived}
        {this.props.content.connectionType}
        {contentBody}
        <button id={this.props.content.id} onClick={() => ReqResCtrl.openEndPoint(this.state.abortController)}>Send</button>
        <button onClick={() => {
          console.log(`aborting fetch for ReqRes ${this.props.content.id}.`);
<<<<<<< HEAD
          console.log(this.props.content.abortController);
          this.props.content.abortController.abort();
=======
          this.state.abortController.abort();
>>>>>>> 653780c191ee018ee9b9689cb7e0a2380ee222cc
        }}>Close</button>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReqRes);