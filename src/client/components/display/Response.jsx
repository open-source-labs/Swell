import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions/actions';

const mapStateToProps = store => ({
 
});

const mapDispatchToProps = dispatch => ({

});

class Response extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    return(
      <div style={{'border' : '1px solid black', 'margin' : '3px', 'display' : 'flex', 'flexDirection' : 'column'}}>
        Response
        {this.props.content.headers}
        {this.props.content.data}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Response);