import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions';
import HistoryDate from '../display/HistoryDate.jsx';
import ClearHistoryBtn from '../display/ClearHistoryBtn.jsx';

const mapStateToProps = store => ({
  history: store.business.history,
  newRequestStreams: store.business.newRequestStreams
});

const mapDispatchToProps = dispatch => ({
  clearHistory: () => { dispatch(actions.clearHistory()) },
  deleteFromHistory: (reqRes) => { dispatch(actions.deleteFromHistory(reqRes)) },
  setNewRequestHeaders: (requestHeadersObj) => { dispatch(actions.setNewRequestHeaders(requestHeadersObj)) },
  setNewRequestFields: (requestFields) => { dispatch(actions.setNewRequestFields(requestFields)) },
  setNewRequestBody: (requestBodyObj) => { dispatch(actions.setNewRequestBody(requestBodyObj)) },
  setNewRequestCookies: (requestCookiesObj) => { dispatch(actions.setNewRequestCookies(requestCookiesObj)) },
  setNewRequestStreams: (requestStreamsObj) => { dispatch(actions.setNewRequestStreams(requestStreamsObj))}
});

class HistoryContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // history is already sorted by created_at from getHistory
    // 1) map through history state and create date component. 2) pass props to new component 
    const historyDates = this.props.history.map((date, i) => { //nvm nvm
    // let historyDates = this.props.history.slice().sort((a, b) => parse(b) - parse(a)).map((date, i) => { //wtf
      return <HistoryDate
        className="historyDate"
        content={date} key={i}
        history={this.props.history}
        deleteFromHistory={this.props.deleteFromHistory}
        setNewRequestFields={this.props.setNewRequestFields}
        setNewRequestHeaders={this.props.setNewRequestHeaders}
        setNewRequestCookies={this.props.setNewRequestCookies}
        setNewRequestBody={this.props.setNewRequestBody}
        setNewRequestStreams={this.props.setNewRequestStreams}
      />
    })

    return (
      <div className="historyDate-container">
        <h1 className="history_title">History
          <span className="clear-history">
            <ClearHistoryBtn clearHistory={this.props.clearHistory} />
          </span>
        </h1>
        {historyDates}
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HistoryContainer);
