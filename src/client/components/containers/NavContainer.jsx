import React, { Component } from 'react';
import { connect } from 'react-redux';
import SelectAllBtn from '../display/SelectAllBtn.jsx';
import DeselectAllBtn from '../display/DeselectAllBtn.jsx';
import ModalContainer from '../Modal/ModalContainer.jsx';

import OpenAllBtn from '../display/OpenAllBtn.jsx';
import CloseAllBtn from '../display/CloseAllBtn.jsx';
import ClearBtn from '../display/ClearBtn.jsx';
// import ToggleAllBtn from '../display/ToggleAllBtn.jsx';
import * as actions from '../../actions/actions';
import TabContainer from '../display/TabContainer.jsx';

const mapStateToProps = store => ({
 
});

const mapDispatchToProps = dispatch => ({
  
});

class Nav extends Component {
  constructor(props) {
    super(props);

  }

  render(props) {
    return(
      <div className={'navbar_modal-console'}>

        <ModalContainer/>
        {/* NavContainer */}
        {/* <ToggleAllBtn connectionStatus={this.props}/> */}

        <SelectAllBtn connectionStatus={this.props}/>
        <DeselectAllBtn connectionStatus={this.props}/>

        <OpenAllBtn connectionStatus={this.props}/>
        <CloseAllBtn connectionStatus={this.props}/>
        <ClearBtn />
      </div>

    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Nav);