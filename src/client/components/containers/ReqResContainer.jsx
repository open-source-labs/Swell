import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions/actions';
import ReqRes from '../display/ReqRes.jsx';

const mapStateToProps = store => ({
 
});

const mapDispatchToProps = dispatch => ({

});

class ReqResContainer extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    return(
      <div>
        ReqResContainer
        <ReqRes/>
        <ReqRes/>
        <ReqRes/>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReqResContainer);