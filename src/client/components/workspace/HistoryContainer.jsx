import React from 'react';
import { connect, useSelector } from 'react-redux';
import * as actions from '../../features/business/businessSlice';
import * as uiactions from '../../features/ui/uiSlice';
import HistoryDate from './HistoryDate';
import ClearHistoryBtn from './buttons/ClearHistoryBtn';

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

  const isDark = useSelector((store) => store.ui.isDark);

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
    <span
      className={`p-3 is-flex is-flex-direction-column is-tall-not-1rem ${isDark ? 'is-dark-400' : ''}`}
      id="history-container"
    >
      <span id="history-container"className="is-flex is-flex-direction-row is-justify-content-space-around is-align-items-center mt-3">
        <ClearHistoryBtn clearHistory={clearHistory} />
      </span>
      <div className="add-vertical-scroll">{historyDates}</div>
    </span>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(HistoryContainer);
