import React, { Component } from 'react';
import History from './History.jsx';
import parse from 'date-fns/parse';
import isYesterday from 'date-fns/is_yesterday';
import isToday from 'date-fns/is_today';
import format from 'date-fns/format';

class HistoryDate extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.focusOnForm = this.focusOnForm.bind(this);
  }

  focusOnForm(event) {
    console.log(this.props)
    if(this.props.content.gRPC) {
      let composerUrlField = document.querySelector('.composer_method_select grpc');
      composerUrlField.focus()

    }
    else {
      let composerUrlField = document.querySelector('.composer_url_input');
      composerUrlField.focus()
    }
    
  }

  render() {
    let current = this.props.history.find(a => a.date === this.props.content.date);
    let date = parse(current.date);

    if (isToday(date)) { date = 'Today' }//If the date matches todays date render the word "Today"
    else if (isYesterday(date)) { date = 'Yesterday' }
    else { date = format(date, 'ddd, MMM D, YYYY') }

    let histArray = current.history.map((history, i) => {
      return <History
        content={history} key={i}
        focusOnForm={this.focusOnForm}
        deleteFromHistory={this.props.deleteFromHistory}
        setNewRequestFields={this.props.setNewRequestFields}
        setNewRequestHeaders={this.props.setNewRequestHeaders}
        setNewRequestCookies={this.props.setNewRequestCookies}
        setNewRequestBody={this.props.setNewRequestBody}
      />
    })

    return (
      <div className={'historyDate'}>
        <h1>{date}</h1>
        {histArray}
      </div>
    )
  }
}

export default HistoryDate;