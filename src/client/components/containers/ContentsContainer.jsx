import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions/actions';
import GraphContainer from './GraphContainer.jsx';
import ReqResContainer from './ReqResContainer.jsx';

const mapStateToProps = store => ({
 
});

const mapDispatchToProps = dispatch => ({

});

class Contents extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    return(
      <div className={'contents'}>
        {/* ContentsContainer */}
        <GraphContainer/>
        <ReqResContainer/>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Contents);