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
    let date = parse(current.date, 'MM/dd/yyyy', new Date())
    // let date = parseISO(current.date)
    if (isToday(date)) {
      console.log('today')
      date = 'Today';
    } // If the date matches todays date render the word "Today"
    else if (isYesterday(date)) {
      date = 'Yesterday';
    } else {
      log('else')
      date = format(date, 'MMM d, yyyy');
    }

    const histArray = current.history.map((history, i) => {
      return (
        <History
          content={history}
          key={i}
          focusOnForm={this.focusOnForm}
          deleteFromHistory={this.props.deleteFromHistory}
          setNewRequestFields={this.props.setNewRequestFields}
          setNewRequestHeaders={this.props.setNewRequestHeaders}
          setNewRequestCookies={this.props.setNewRequestCookies}
          setNewRequestBody={this.props.setNewRequestBody}
          setNewRequestStreams={this.props.setNewRequestStreams}
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
