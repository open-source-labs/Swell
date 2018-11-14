import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions/actions';

const mapStateToProps = store => ({
  reqResArray : store.business.reqResArray,
  modalDisplay : store.ui.modalDisplay,
});

const mapDispatchToProps = dispatch => ({

});

class ModalContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div>
        ModalContainer
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalContainer);