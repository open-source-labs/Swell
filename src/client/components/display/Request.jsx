import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions/actions';

const mapStateToProps = store => ({
 
});

const mapDispatchToProps = dispatch => ({

});

class Request extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    let headerArr = this.props.content.headers.map((header, index) => {
      return (<div key={index} style={{'display' : 'flex'}}>
        <div style={{'width' : '50%'}}>{header.key}</div>
        <div style={{'width' : '50%'}}>{header.value}</div>
      </div>)
    })

    return(
      <div className={'resreq-res-header'}>
        <h1 className={'resreq_title'}>Request</h1>
        {this.props.content.method}
        {headerArr}
        {/* {this.props.content.body} */}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Request);