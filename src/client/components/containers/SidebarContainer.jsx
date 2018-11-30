import React, { Component } from 'react';

import ModalContainer from '../Modal/ModalContainer.jsx';
import HistoryContainer from './HistoryContainer.jsx';


class SidebarContainer extends Component {
  constructor(props) {
    super(props);
  }

  render(props) {
    return(
      <div className={'sidebar_modal-console'}>

        <ModalContainer/>
        <HistoryContainer className='historyContainer' />
      </div>

    )
  }
}

export default (SidebarContainer);