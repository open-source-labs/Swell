import * as React from "react";
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
        <ComposerContainer />
        <CollectionsContainer />
        <HistoryContainer />
      </div>
    );
  }
}

//export default SidebarContainer;
