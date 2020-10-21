import * as React from "react";
import { Route, Switch, Link } from 'react-router-dom';

import ComposerContainer from "../composer/ComposerContainer.jsx";
import HistoryContainer from "./HistoryContainer.jsx";
import CollectionsContainer from "./CollectionsContainer.jsx";

export class SidebarContainer extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div className="sidebar_composer-console">
        {/* <ComposerContainer /> */}
        {/* TEMPORARILY CUT OUT CollectionsContainer */}
        {/* <CollectionsContainer /> */}
        {/* <HistoryContainer /> */}


        <div>
          {/* INSERT TAB SELECTOR HERE */}
          <Link to="/composer">Composer</Link><br/>
          <Link to="/history">History</Link><br/>
          <hr/>
          {/* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */}
        </div>
        <Switch>
          <Route path="/composer"> <ComposerContainer /> </Route>
          <Route path="/history"> <HistoryContainer /> </Route>
          <Route path="/"> <ComposerContainer /> </Route>
        </Switch>



      </div>
    );
  }
}

//export default SidebarContainer;
