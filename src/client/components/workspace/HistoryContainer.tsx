import React from 'react';
import { useAppSelector, useAppDispatch } from '~/toolkit/store';
import { type ReqRes } from '~/types';

import * as HistorySlice from '~/toolkit/slices/historySlice';
import { fieldsReplaced } from '~/toolkit/slices/newRequestFieldsSlice';
import {
  newRequestCookiesSet,
  newRequestStreamsSet,
  newRequestBodySet,
  newRequestHeadersSet,
} from '~/toolkit/slices/newRequestSlice';

import HistoryDate from './HistoryDate';
import ClearHistoryBtn from './buttons/ClearHistoryBtn';

const HistoryContainer = () => {
  const history = useAppSelector((store) => store.history);
  const newFields = useAppSelector((store) => store.newRequestFields);
  const isDark = useAppSelector((store) => store.ui.isDark);
  const dispatch = useAppDispatch();

  return (
    <span
      id="history-container"
      className={`p-3 is-flex is-flex-direction-column is-tall-not-1rem ${
        isDark ? 'is-dark-400' : ''
      }`}
    >
      <span
        id="history-container"
        className="is-flex is-flex-direction-row is-justify-content-space-around is-align-items-center mt-3"
      >
        <ClearHistoryBtn
          historyCleared={() => {
            dispatch(HistorySlice.historyCleared());
          }}
        />
      </span>

      <div className="add-vertical-scroll">
        {history.map((item, i) => (
          /**
           * Previous comment: History is already sorted by created_at from
           * getHistory.
           *
           * ---
           *
           * @todo 2023-08-31 - This is almost certainly a bad component design,
           * but no time to redesign it.
           *
           * HistoryDate can call useAppDispatch, and then wire up any callbacks
           * it needs itself. On the flipside of lifting state up, you should
           * also "tamp" state down as far down as you can, to avoid needless
           * re-renders and make sure any useEffect calls in downstream
           * components don't run way more than intended
           */
          <HistoryDate
            key={i}
            className="historyDate"
            newRequestFields={newFields}
            content={item}
            history={history}
            historyCleared={() => {
              dispatch(HistorySlice.historyCleared());
            }}
            historyDeleted={(r: ReqRes) => {
              dispatch(HistorySlice.historyDeleted(r));
            }}
            fieldsReplaced={(requestFields) => {
              dispatch(fieldsReplaced(requestFields));
            }}
            newRequestHeadersSet={(requestHeadersObj) => {
              dispatch(newRequestHeadersSet(requestHeadersObj));
            }}
            newRequestCookiesSet={(requestCookiesObj) => {
              dispatch(newRequestCookiesSet(requestCookiesObj));
            }}
            newRequestBodySet={(requestBodyObj) => {
              dispatch(newRequestBodySet(requestBodyObj));
            }}
            newRequestStreamsSet={(stream) => {
              dispatch(newRequestStreamsSet(stream));
            }}
          />
        ))}
      </div>
    </span>
  );
};

export default HistoryContainer;
