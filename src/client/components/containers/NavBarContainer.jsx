import React, { Component } from 'react';
import SelectAllBtn from '../display/SelectAllBtn.jsx';
import DeselectAllBtn from '../display/DeselectAllBtn.jsx';
import OpenAllBtn from '../display/OpenAllBtn.jsx';
import CloseAllBtn from '../display/CloseAllBtn.jsx';
import ClearBtn from '../display/ClearBtn.jsx';


class NavBarContainer extends Component {
  constructor(props) {
    super(props);
  }

  render(props) {
    return(
      <div className={'navbar-console'}>
        <div className={'navbar-console_inner'}>
          <SelectAllBtn />
          <DeselectAllBtn />
          <OpenAllBtn />
          <CloseAllBtn />
          <ClearBtn />
        </div>
      </div>

    );
  }
}

export default (NavBarContainer);
