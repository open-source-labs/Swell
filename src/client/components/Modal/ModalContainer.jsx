import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions';

import ModalNewRequest from './NewRequest/ModalNewRequest.jsx';
import ModalWarning from './Warning/ModalWarning.jsx';

const mapStateToProps = store => ({
  reqResArray: store.business.reqResArray,
  modalDisplay: store.ui.modalDisplay,
});

const mapDispatchToProps = dispatch => ({});

class ModalContainer extends Component {
  constructor(props) {
    super(props);
    // console.log(this.props);
    this.state = {};
  }

  componentDidMount() {
    this.setState({
      modalDisplay: this.props.modalDisplay,
    });
  }

  componentDidUpdate() {
    if (this.props.modalDisplay !== this.state.modalDisplay) {
      this.setState({
        modalDisplay: this.props.modalDisplay,
      });
    }
  }

  render() {
    let modalContents;
    switch (this.state.modalDisplay) {
      case 'Request': {
        modalContents = <ModalNewRequest />;
        break;
      }
      case 'Warning': {
        modalContents = <ModalWarning />;
        break;
      }
      default:
        console.log('Incorrect Model Display setting');
    }

    return <div className="modalContents">{modalContents}</div>;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ModalContainer);
