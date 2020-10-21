import * as React from "react";
import BarGraph from "../display/BarGraph"
import ReqResContainer from "./ReqResContainer.jsx";
import NavBarContainer from "./NavBarContainer.jsx";

export class ContentsContainer extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div className="column is-one-third">
        <BarGraph />
        <NavBarContainer />
        <ReqResContainer />
      </div>
    );
  }
}
