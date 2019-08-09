import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions';
import HistoryDate from '../display/HistoryDate.jsx';

const mapStateToProps = store => ({
  history: store.business.history,
});

const mapDispatchToProps = dispatch => ({
  deleteFromHistory: (reqRes) => { dispatch(actions.deleteFromHistory(reqRes)) },
  setNewRequestHeaders: (requestHeadersObj) => { dispatch(actions.setNewRequestHeaders(requestHeadersObj)) },
  setNewRequestFields: (requestFields) => { dispatch(actions.setNewRequestFields(requestFields)) },
  setNewRequestBody: (requestBodyObj) => { dispatch(actions.setNewRequestBody(requestBodyObj)) },
  setNewRequestCookies: (requestCookiesObj) => { dispatch(actions.setNewRequestCookies(requestCookiesObj)) },
});

class HistoryContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // history is already sorted by created_at from getHistory
    //1) map through history state and create date component. 2) pass props to new component 
    let historyDates = this.props.history.map((date, i) => {
      return <HistoryDate
        className="historyDate"
        content={date} key={i}
        history={this.props.history}
        deleteFromHistory={this.props.deleteFromHistory}
        setNewRequestFields={this.props.setNewRequestFields}
        setNewRequestHeaders={this.props.setNewRequestHeaders}
        setNewRequestCookies={this.props.setNewRequestCookies}
        setNewRequestBody={this.props.setNewRequestBody}
      />
    })

    return (
      <div className={'historyDate-container'}>
        {historyDates}
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HistoryContainer);
