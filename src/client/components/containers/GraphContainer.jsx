import React, { Component } from 'react';
import { connect } from 'react-redux';

import Chart from '../display/Chart.jsx';

import * as actions from '../../actions/actions';

const mapStateToProps = store => ({
 
});

const mapDispatchToProps = dispatch => ({

});

class Graph extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    return(
      <div>
        GraphContainer
        <Chart />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Graph);