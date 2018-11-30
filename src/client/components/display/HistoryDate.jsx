import React, { Component } from 'react';
import { connect } from "react-redux";
import * as actions from '../../actions/actions';
import History from './History.jsx';
import parse from 'date-fns/parse';
import isYesterday from 'date-fns/is_yesterday';
import isToday from 'date-fns/is_today';
import format from 'date-fns/format';


const mapStateToProps = store => ({
  history : store.business.history,
});

const mapDispatchToProps = dispatch => ({
})

class HistoryDate extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let current = this.props.history.find(a => a.date === this.props.content.date);
    // let dateArr = current.date.split('-');
    // let date = new Date(dateArr[0], dateArr[1]-1, dateArr[2]);
    let date = parse(current.date);
    if (isToday(date)) { date = 'Today' }
    else if (isYesterday(date)) { date = 'Yesterday' }
    else { date = format(date, 'ddd, MMM D, YYYY')}
    console.log(date);
    let histArray = current.history.map((history, i) => {
      return <History className="historyChild" content={history} key={i}></History>
    })

    return(
      <div className={'historyDate'}>
        <h1>{date}</h1>
        {histArray}
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HistoryDate);