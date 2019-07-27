import React, { Component } from 'react';
import { connect } from "react-redux";
import * as actions from '../../actions/actions';
import History from './History.jsx';
import parse from 'date-fns/parse';
import isYesterday from 'date-fns/is_yesterday';
import isToday from 'date-fns/is_today';
import format from 'date-fns/format';


const mapStateToProps = store => ({
  history: store.business.history,
});

const mapDispatchToProps = dispatch => ({
})

class HistoryDate extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.focusOnForm = this.focusOnForm.bind(this);
  }

  focusOnForm(event) {
    let composerUrlField = document.querySelector('.composer_url_input');
    composerUrlField.focus()
  }

  render() {
    let current = this.props.history.find(a => a.date === this.props.content.date);
    let date = parse(current.date);

    if (isToday(date)) { date = 'Today' }//If the date matches todays date render the word "Today"
    else if (isYesterday(date)) { date = 'Yesterday' }
    else { date = format(date, 'ddd, MMM D, YYYY') }

    let histArray = current.history.map((history, i) => {
      return <History className="historyChild" content={history} key={i} focusOnForm={this.focusOnForm}></History>
    })

    return (
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