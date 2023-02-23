import React from 'react';
import { connect, useSelector } from 'react-redux';

import * as HistorySlice from '../../toolkit-refactor/history/historySlice';
import { fieldsReplaced } from '../../toolkit-refactor/newRequestFields/newRequestFieldsSlice';

import {
  newRequestCookiesSet,
  newRequestStreamsSet,
  newRequestBodySet,
  newRequestHeadersSet,
} from '../../toolkit-refactor/newRequest/newRequestSlice';

import HistoryDate from './HistoryDate';
import ClearHistoryBtn from './buttons/ClearHistoryBtn';

/**@todo switch to hooks? */
const mapStateToProps = (store) => ({
  history: store.history,
  newRequestFields: store.newRequestFields,
  newRequestStreams: store.newRequest.newRequestStreams,
});

/**@todo switch to hooks? */
const mapDispatchToProps = (dispatch) => ({
  historyCleared: () => {
    dispatch(HistorySlice.historyCleared());
  },
  historyDeleted: (reqRes) => {
    dispatch(HistorySlice.historyDeleted(reqRes));
  },
  newRequestHeadersSet: (requestHeadersObj) => {
    dispatch(newRequestHeadersSet(requestHeadersObj));
  },
  fieldsReplaced: (requestFields) => {
    dispatch(fieldsReplaced(requestFields));
  },
  newRequestBodySet: (requestBodyObj) => {
    dispatch(newRequestBodySet(requestBodyObj));
  },
  newRequestCookiesSet: (requestCookiesObj) => {
    dispatch(newRequestCookiesSet(requestCookiesObj));
  },
  newRequestStreamsSet: (requestStreamsObj) => {
    dispatch(newRequestStreamsSet(requestStreamsObj));
  },
});

const HistoryContainer = (props) => {
  const {
    history,
    historyCleared,
    historyDeleted,
    fieldsReplaced,
    newRequestHeadersSet,
    newRequestCookiesSet,
    newRequestBodySet,
    newRequestStreamsSet,
  } = props;

  const isDark = useSelector((store) => store.ui.isDark);

  // history is already sorted by created_at from getHistory
  const historyDates = history.map((date, index) => (
    <HistoryDate
      className="historyDate"
      content={date}
      key={index}
      history={history}
      historyDeleted={historyDeleted}
      fieldsReplaced={fieldsReplaced}
      newRequestHeadersSet={newRequestHeadersSet}
      newRequestCookiesSet={newRequestCookiesSet}
      newRequestBodySet={newRequestBodySet}
      newRequestStreamsSet={newRequestStreamsSet}
    />
  ));

  return (
    <span
      className={`p-3 is-flex is-flex-direction-column is-tall-not-1rem ${
        isDark ? 'is-dark-400' : ''
      }`}
      id="history-container"
    >
      <span
        id="history-container"
        className="is-flex is-flex-direction-row is-justify-content-space-around is-align-items-center mt-3"
      >
        <ClearHistoryBtn historyCleared={historyCleared} />
      </span>
      <div className="add-vertical-scroll">{historyDates}</div>
    </span>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(HistoryContainer);
