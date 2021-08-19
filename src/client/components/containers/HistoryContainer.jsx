import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions';
import HistoryDate from '../display/HistoryDate.jsx';
import ClearHistoryBtn from '../display/ClearHistoryBtn.jsx';

const mapStateToProps = (store) => ({
  history: store.business.history,
  newRequestFields: store.business.newRequestFields,
  newRequestStreams: store.business.newRequestStreams,
});

const mapDispatchToProps = (dispatch) => ({
  clearHistory: () => {
    dispatch(actions.clearHistory());
  },
  deleteFromHistory: (reqRes) => {
    dispatch(actions.deleteFromHistory(reqRes));
  },
  setNewRequestHeaders: (requestHeadersObj) => {
    dispatch(actions.setNewRequestHeaders(requestHeadersObj));
  },
  setNewRequestFields: (requestFields) => {
    dispatch(actions.setNewRequestFields(requestFields));
  },
  setNewRequestBody: (requestBodyObj) => {
    dispatch(actions.setNewRequestBody(requestBodyObj));
  },
  setNewRequestCookies: (requestCookiesObj) => {
    dispatch(actions.setNewRequestCookies(requestCookiesObj));
  },
  setNewRequestStreams: (requestStreamsObj) => {
    dispatch(actions.setNewRequestStreams(requestStreamsObj));
  },
});

const HistoryContainer = (props) => {
  const {
    history,
    clearHistory,
    deleteFromHistory,
    setNewRequestFields,
    setNewRequestHeaders,
    setNewRequestCookies,
    setNewRequestBody,
    setNewRequestStreams,
  } = props;

  // history is already sorted by created_at from getHistory
  const historyDates = history.map((date, i) => {
    return (
      <HistoryDate
        className="historyDate"
        content={date}
        key={i}
        history={history}
        deleteFromHistory={deleteFromHistory}
        setNewRequestFields={setNewRequestFields}
        setNewRequestHeaders={setNewRequestHeaders}
        setNewRequestCookies={setNewRequestCookies}
        setNewRequestBody={setNewRequestBody}
        setNewRequestStreams={setNewRequestStreams}
      />
    );
  });

  return (
    <div
      className="p-3 is-flex is-flex-direction-column is-tall-not-5rem"
      id="history-container"
    >
      <div>
        <ClearHistoryBtn clearHistory={clearHistory} />
      </div>
      <div className="add-vertical-scroll">{historyDates}</div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(HistoryContainer);
