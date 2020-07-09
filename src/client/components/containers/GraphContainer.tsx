import * as React from "react";
import Graph from "../display/Graph.jsx";

export class GraphContainer extends React.Component<any, any> {
  constructor(props: any) {
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

//export default GraphContainer;
