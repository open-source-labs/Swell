import React from React;
import SidebarContainer from './SidebarContainer';
import ResponsePaneContainer from './ResponsePaneContainer';

const RightSideContainer = () => {
    return (
        <div classname="is-vertical">
        	<SidebarContainer />
          <ResponsePaneContainer />
        </div>
    )
}


export default RightSideContainer;