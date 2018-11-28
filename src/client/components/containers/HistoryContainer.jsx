import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions';

const mapStateToProps = store => ({});

const mapDispatchToProps = dispatch => ({});

class HistoryContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        HISTORY GOES HERE
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HistoryContainer);
