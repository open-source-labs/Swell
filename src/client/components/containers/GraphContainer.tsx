import * as React from "react";
import BarGraph from "../display/BarGraph.jsx";

export class GraphContainer extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div>
        <BarGraph />
      </div>
    );
  }
}
