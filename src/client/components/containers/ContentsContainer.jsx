import React, { Component } from 'react';

import * as actions from '../../actions/actions';
import GraphContainer from './GraphContainer.jsx';
import ReqResContainer from './ReqResContainer.jsx';
import TabContainer from '../display/TabContainer.jsx';
import NavBarContainer from './NavBarContainer.jsx';

class Contents extends Component {
  constructor (props) {
    super(props);
  }

  render() {
    return(
      <div className={'contents'}>
        <GraphContainer/>
        <NavBarContainer/>
        <TabContainer/>
        <ReqResContainer/>
      </div>
    )
  }
}

export default (Contents);
