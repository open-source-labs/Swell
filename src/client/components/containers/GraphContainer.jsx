import React, { Component } from 'react';
import Graph from '../display/Graph.jsx';

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

export default GraphContainer;
