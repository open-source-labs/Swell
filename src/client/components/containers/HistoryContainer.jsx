import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions';
import HistoryDate from '../display/HistoryDate.jsx';
import parse from 'date-fns/parse';

const mapStateToProps = store => ({
  history: store.business.history,
});

const mapDispatchToProps = dispatch => ({
  reqResAdd: (reqRes) => { dispatch(actions.reqResAdd(reqRes)) },
  reqResDelete: (reqRes) => { dispatch(actions.reqResDelete(reqRes)) },
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
    // console.log(this.props.history);
    let historyDates = this.props.history.slice().sort((a, b) => parse(b) - parse(a)).map((date, i) => { //wtf
      return <HistoryDate
        className="historyDate"
        content={date} key={i}
        history={this.props.history}
        reqResAdd={this.props.reqResAdd}
        reqResDelete={this.props.reqResDelete}
        setNewRequestFields={this.props.setNewRequestFields}
        setNewRequestHeaders={this.props.setNewRequestHeaders}
        setNewRequestCookies={this.props.setNewRequestCookies}
        setNewRequestBody={this.props.setNewRequestBody}
      />
      //1) map through history state and create date component. 2) pass props to new component 
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
