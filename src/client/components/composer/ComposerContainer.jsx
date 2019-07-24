import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions';

import ModalNewRequest from './NewRequest/ComposerNewRequest.jsx';
import ModalWarning from './Warning/ComposerWarning.jsx';

const mapStateToProps = store => ({
  reqResArray: store.business.reqResArray,
  composerDisplay: store.ui.composerDisplay,
});

const mapDispatchToProps = dispatch => ({});

class ComposerContainer extends Component {
  constructor(props) {
    super(props);
    // console.log(this.props);
    this.state = {};
  }

  componentDidMount() {
    this.setState({
      composerDisplay: this.props.composerDisplay,
    });
  }

  componentDidUpdate() {//keeping the redux store state in sync with this component's local state
    if (this.props.composerDisplay !== this.state.composerDisplay) {
      this.setState({
        composerDisplay: this.props.composerDisplay,
      });
    }
  }

  render() {
    let composerContents;
    switch (this.state.composerDisplay) { // conditional rendering of components based on the value of composerDisplay in redux store
      case 'Request': {
        composerContents = <ModalNewRequest />;
        break;
      }
      case 'Warning': {
        composerContents = <ModalWarning />;
        break;
      }
      default:
        console.log('Incorrect Model Display setting');
    }

    return <div className="composerContents">{composerContents}</div>;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ComposerContainer);
