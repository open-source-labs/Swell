import React, { Component } from 'react';
import SelectAllBtn from '../display/SelectAllBtn.jsx';
import DeselectAllBtn from '../display/DeselectAllBtn.jsx';
import ModalContainer from '../Modal/ModalContainer.jsx';

import OpenAllBtn from '../display/OpenAllBtn.jsx';
import CloseAllBtn from '../display/CloseAllBtn.jsx';
import ClearBtn from '../display/ClearBtn.jsx';


class Nav extends Component {
  constructor(props) {
    super(props);

  }

  render(props) {
    return(
      <div className={'navbar_modal-console'}>

        <ModalContainer/>

        <SelectAllBtn connectionStatus={this.props}/>
        <DeselectAllBtn connectionStatus={this.props}/>

        <OpenAllBtn connectionStatus={this.props}/>
        <CloseAllBtn connectionStatus={this.props}/>
        <ClearBtn />
      </div>

    )
  }
}

export default (Nav);
