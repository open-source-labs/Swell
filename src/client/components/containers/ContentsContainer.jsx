import React, { Component } from "react";

// import GraphContainer from './GraphContainer.jsx';
<<<<<<< HEAD
import ReqResContainer from "./ReqResContainer.jsx";
import NavBarContainer from "./NavBarContainer.jsx";
=======
import ReqResContainer from './ReqResContainer.jsx';
import NavBarContainer from './NavBarContainer.jsx';
>>>>>>> preload

class Contents extends Component {
  constructor(props) {
    super(props);
  }

  render() {
<<<<<<< HEAD
    return (
      <div className={"contents"}>
        {/* <GraphContainer/> */}
        <NavBarContainer />
        <ReqResContainer />
=======
    return(
      <div className={'contents'}>
        {/* <GraphContainer/> */}
        <NavBarContainer/>
        <ReqResContainer/>
>>>>>>> preload
      </div>
    );
  }
}

export default Contents;
