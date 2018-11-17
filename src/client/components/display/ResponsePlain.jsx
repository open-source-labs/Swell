import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions/actions';

const mapStateToProps = store => ({
 
});

const mapDispatchToProps = dispatch => ({

});

class ResponsePlain extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    console.log(this.props);
    return(
      <div style={{'border' : '1px solid black', 'margin' : '3px', 'display' : 'flex', 'flexDirection' : 'column'}}>
        ResponsePlain
        <div>{JSON.stringify(this.props.content.events[0])}</div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResponsePlain);