import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions';
import HistoryDate from '../display/HistoryDate.jsx'

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

    let historyDates = this.props.history.map((date, i) => {
      return <HistoryDate className="historyDate" content={date} key={i}></HistoryDate>
    })

    return(
      <div>
        {historyDates}
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HistoryContainer);
