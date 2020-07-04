import React, { Component } from "react";

// import GraphContainer from './GraphContainer.jsx';
import ReqResContainer from './ReqResContainer.jsx';
import NavBarContainer from './NavBarContainer.jsx';

class Contents extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div className={'contents'}>
        {/* <GraphContainer/> */}
        <NavBarContainer/>
        <ReqResContainer/>
      </div>
    );
  }
}

export default Contents;
