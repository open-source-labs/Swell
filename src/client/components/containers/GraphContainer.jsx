import React, { Component } from 'react';
import { connect } from 'react-redux';
import Graph from '../display/Graph.jsx';
import * as actions from '../../actions/actions';

const mapStateToProps = store => ({});

const mapDispatchToProps = dispatch => ({});

class GraphContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Graph />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GraphContainer);
