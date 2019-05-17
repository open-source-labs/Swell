import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions';
import HistoryDate from '../display/HistoryDate.jsx';
import parse from 'date-fns/parse';

const mapStateToProps = store => ({
  history: store.business.history,
});

const mapDispatchToProps = dispatch => ({});

class HistoryContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // console.log(this.props.history);
    let historyDates = this.props.history.slice().sort((a, b) => parse(b) - parse(a)) .map((date, i) => {
      return <HistoryDate className="historyDate" content={date} key={i}></HistoryDate>
    })

    return(
      <div className={'historyDate-container'}>
        {/* <div className={'sidebar_history-inner'}> */}
          {historyDates}
        {/* </div> */}
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HistoryContainer);
