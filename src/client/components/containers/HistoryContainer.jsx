import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions';
import History from '../display/History.jsx';

const mapStateToProps = store => ({
  history: store.business.history,
});

const mapDispatchToProps = dispatch => ({});

class HistoryContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const historyArray = this.props.history
      .map((history, i) => <History className="historyChild" content={history} key={i} />)
      .reverse();

    return <div>{historyArray}</div>;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HistoryContainer);
