import * as React from "react";
import loadable from "@loadable/component";

// lazy loading to reduce bundle size (chart.js)
const BarGraph = loadable(() => import('../display/BarGraph'))

import ReqResContainer from "./ReqResContainer.jsx";
import NavBarContainer from "./NavBarContainer.jsx";

export class ContentsContainer extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div className="contents">
        <BarGraph />
        <NavBarContainer />
        <ReqResContainer />
      </div>
    );
  }
}
