import React from 'react';
import { connect } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../../toolkit-refactor/hooks';

import * as HistorySlice from '../../toolkit-refactor/slices/historySlice';
import { fieldsReplaced } from '../../toolkit-refactor/slices/newRequestFieldsSlice';

import {
  newRequestCookiesSet,
  newRequestStreamsSet,
  newRequestBodySet,
  newRequestHeadersSet,
} from '../../toolkit-refactor/slices/newRequestSlice';

import HistoryDate from './HistoryDate';
import ClearHistoryBtn from './buttons/ClearHistoryBtn';
import { Dispatch } from 'redux';

import {
  $TSFixMe,
  ReqRes,
  NewRequestBody,
  CookieOrHeader,
  NewRequestStreams,
  NewRequestFields,
  $TSFixMeObject,
} from '../../../types';

import { RootState } from '../../toolkit-refactor/store';

interface NewRequestCookiesSet {
  cookiesArr: CookieOrHeader[];
  count: number;
}

interface NewRequestHeadersSet {
  headersArr: CookieOrHeader[];
  count: number;
}

// interface Props {
//   history: [];
//   historyCleared: () => void;
//   historyDeleted: string;
//   fieldsReplaced: (obj: {}) => void;
//   newRequestHeadersSet: (obj: NewRequestHeadersSet) => void;
//   newRequestCookiesSet: (obj: NewRequestCookiesSet) => void;
//   newRequestBodySet: (obj: NewRequestBody) => void;
//   newRequestStreamsSet: NewRequestStreams;
//   className: string;
// }

// /**@todo switch to hooks? */
// const mapStateToProps = (store: RootState) => ({
//   history: store.history,
//   newRequestFields: store.newRequestFields,
//   newRequestStreams: store.newRequest.newRequestStreams,
// });

// /**@todo switch to hooks? */
// const mapDispatchToProps = (dispatch: Dispatch) => ({
//   historyCleared: () => {
//     dispatch(HistorySlice.historyCleared());
//   },
//   historyDeleted: (reqRes: ReqRes) => {
//     dispatch(HistorySlice.historyDeleted(reqRes));
//   },
//   newRequestHeadersSet: (requestHeadersObj: $TSFixMe) => {
//     dispatch(newRequestHeadersSet(requestHeadersObj));
//   },
//   fieldsReplaced: (requestFields: $TSFixMe) => {
//     dispatch(fieldsReplaced(requestFields));
//   },
//   newRequestBodySet: (requestBodyObj: $TSFixMe) => {
//     dispatch(newRequestBodySet(requestBodyObj));
//   },
//   newRequestCookiesSet: (requestCookiesObj: $TSFixMe) => {
//     dispatch(newRequestCookiesSet(requestCookiesObj));
//   },
//   newRequestStreamsSet: (requestStreamsObj: $TSFixMe) => {
//     dispatch(newRequestStreamsSet(requestStreamsObj));
//   },
// });
// const {
//   history,
//   historyCleared,
//   historyDeleted,
//   fieldsReplaced,
//   newRequestHeadersSet,
//   newRequestCookiesSet,
//   newRequestBodySet,
//   newRequestStreamsSet,
// } = props;

const HistoryContainer = () => {
  const dispatch = useAppDispatch();

  // useAppSelectors

  const history = useAppSelector((state) => state.history);
  const newRequestFields = useAppSelector((state) => state.newRequestFields);

  // useAppDispatchers
  /**@todo switch to hooks? */

  const historyClearedAction = () => dispatch(HistorySlice.historyCleared());
  const historyDeletedAction = (reqRes: ReqRes) =>
    dispatch(HistorySlice.historyDeleted(reqRes));

  const newRequestHeadersSetAction = (requestHeadersObj: $TSFixMeObject) =>
    dispatch(newRequestHeadersSet(requestHeadersObj));
  const fieldsReplacedAction = (requestFields: $TSFixMeObject) =>
    dispatch(fieldsReplaced(requestFields));
  const newRequestBodySetAction = (requestBodyObj: $TSFixMeObject) =>
    dispatch(newRequestBodySet(requestBodyObj));
  const newRequestCookiesSetAction = (requestCookiesObj: $TSFixMeObject) =>
    dispatch(newRequestCookiesSet(requestCookiesObj));
  const newRequestStreamsSetAction = (requestStreamsObj: $TSFixMeObject) =>
    dispatch(newRequestStreamsSet(requestStreamsObj));

  const isDark = useAppSelector(
    (store: { ui: { isDark: boolean } }) => store.ui.isDark
  );

  // history is already sorted by created_at from getHistory
  // (date: Date, index: number): JSX.Element => (
  const historyDates = history.map((date: Date, index: number): JSX.Element => (
    <HistoryDate
      className="historyDate"
      content={date}
      key={index}
      history={history}
      historyDeleted={historyDeletedAction}
      fieldsReplaced={fieldsReplacedAction}
      newRequestHeadersSet={newRequestHeadersSetAction}
      newRequestCookiesSet={newRequestCookiesSetAction}
      newRequestBodySet={newRequestBodySetAction}
      newRequestStreamsSet={newRequestStreamsSetAction}
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
        <ClearHistoryBtn historyCleared={historyClearedAction} />
      </span>
      <div className="add-vertical-scroll">{historyDates}</div>
    </span>
  );
};

export default HistoryContainer;
