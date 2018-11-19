import React, { Component } from 'react';
import { connect } from 'react-redux';
import OpenAllBtn from '../display/OpenAllBtn.jsx';
import CloseAllBtn from '../display/CloseAllBtn.jsx';
import ClearBtn from '../display/ClearBtn.jsx';
// import ToggleAllBtn from '../display/ToggleAllBtn.jsx';
import * as actions from '../../actions/actions';

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
      <div>
        NavContainer
        {/* <ToggleAllBtn connectionStatus={this.props}/> */}

        <OpenAllBtn connectionStatus={this.props}/>
        <CloseAllBtn connectionStatus={this.props}/>
        <ClearBtn />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Nav);