import React, { Component } from 'react';
import { isYesterday, isToday, parseISO, parse, format } from 'date-fns';
import History from './History.jsx';

class HistoryDate extends Component {
  constructor(props) {
    super(props);
    this.focusOnForm = this.focusOnForm.bind(this);
  }

  focusOnForm(event) {
    const composerUrlField = document.querySelector('.composer_url_input');
    composerUrlField.focus();
  }

  render() {
    const current = this.props.history.find(
      (a) => a.date === this.props.content.date
    );
    let date = parse(current.date, 'MM/dd/yyyy', new Date());
    // let date = parseISO(current.date)
    if (isToday(date)) {
      date = 'Today';
    } // If the date matches todays date render the word "Today"
    else if (isYesterday(date)) {
      date = 'Yesterday';
    } else {
      date = format(date, 'MMM d, yyyy');
    }

    const histArray = current.history.map((history, i) => {
      return (
        <History
          content={history}
          key={i}
          focusOnForm={this.focusOnForm}
          historyDeleted={this.props.historyDeleted}
          fieldsReplaced={this.props.fieldsReplaced}
          newRequestHeadersSet={this.props.newRequestHeadersSet}
          newRequestCookiesSet={this.props.newRequestCookiesSet}
          newRequestBodySet={this.props.newRequestBodySet}
          newRequestStreamsSet={this.props.newRequestStreamsSet}
          newRequestFields={this.props.newRequestFields}
        />
      );
    });

    return (
      <div>
        <h5 className="history-date" aria-label="queryDate">
          {date}
        </h5>
        {histArray}
        <hr />
      </div>
    );
  }
}

export default HistoryDate;
