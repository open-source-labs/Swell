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
      <div>
        Response
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Response);