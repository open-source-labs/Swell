import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions/actions';

const mapStateToProps = store => ({
  warningModalMessage : store.business.warningModalMessage,
});

const mapDispatchToProps = dispatch => ({
  setModalDisplay : (modalDisplay) => {
    dispatch(actions.setModalDisplay(modalDisplay));
  }
});

class ModalWarning extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.hideWarning = this.hideWarning.bind(this);
  }

  hideWarning () {
    this.props.setModalDisplay('Request');
  }

  render() {
    return(
      <div style={{'border' : '1px solid black', 'margin' : '3px', 'display' : 'flex', 'flexDirection' : 'column'}}>
        ModalWarning
        <div>{this.props.warningModalMessage}</div>
        <button onClick={this.hideWarning}>Ok</button>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalWarning);