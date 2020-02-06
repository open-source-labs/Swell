import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions';
import HistoryDate from '../display/HistoryDate.jsx';
import ClearHistoryBtn from '../display/ClearHistoryBtn.jsx';
import historyController from '../../controllers/historyController';

const { dialog } = require('electron').remote;
import parse from 'date-fns/parse'


const mapStateToProps = store => ({
  history: store.business.history,
});

const mapDispatchToProps = dispatch => ({
  clearHistory: () => { dispatch(actions.clearHistory()) },
  deleteFromHistory: (reqRes) => { dispatch(actions.deleteFromHistory(reqRes)) },
  setNewRequestHeaders: (requestHeadersObj) => { dispatch(actions.setNewRequestHeaders(requestHeadersObj)) },
  setNewRequestFields: (requestFields) => { dispatch(actions.setNewRequestFields(requestFields)) },
  setNewRequestBody: (requestBodyObj) => { dispatch(actions.setNewRequestBody(requestBodyObj)) },
  setNewRequestCookies: (requestCookiesObj) => { dispatch(actions.setNewRequestCookies(requestCookiesObj)) },
  setNewRequestStreams: (requestStreams) => { dispatch(actions.setNewRequestStreams(requestStreams))}
});

class HistoryContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // history is already sorted by created_at from getHistory
    //1) map through history state and create date component. 2) pass props to new component 
    let historyDates = this.props.history.map((date, i) => { //nvm nvm
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
      <div className={'historyDate-container'}>
        <h1>History</h1>
        <div className="clear-history">
          <ClearHistoryBtn clearHistory={this.props.clearHistory} />
        </div>
        {historyDates}
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HistoryContainer);
