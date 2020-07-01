import React, { Component } from 'react';
// import ComposerContainer from '../composer/ComposerContainer.jsx';
import HistoryContainer from './HistoryContainer.jsx';
// import CollectionsContainer from './CollectionsContainer.jsx';

class SidebarContainer extends Component {
  constructor(props) {
    super(props);
  }

  render(props) {
    return (
      <div className="sidebar_composer-console">
        {/* <ComposerContainer />
        <CollectionsContainer /> */}
        <HistoryContainer />
      </div>
    );
  }
}

export default SidebarContainer;
