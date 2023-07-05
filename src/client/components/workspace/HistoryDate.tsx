import React, { Component } from 'react';
import { isYesterday, isToday, parseISO, parse, format } from 'date-fns';
import History from './History.tsx';

import {
  NewRequestBody, 
  CookieOrHeader, 
  NewRequestStreams, 
  NewRequestFields,
  NewRequestBodySet,
  NewRequestHeadersSet,
  NewRequestCookiesSet,
  FieldsReplaced
} from '../../../types'


interface Props {
  history: object[],
  historyCleared: () => void,
  historyDeleted: string,
  fieldsReplaced: FieldsReplaced,
  newRequestHeadersSet: NewRequestHeadersSet,
  newRequestCookiesSet: NewRequestCookiesSet,
  newRequestBodySet: NewRequestBodySet,
  newRequestStreamsSet: NewRequestStreams,
  newRequestFields: NewRequestFields,
  className: string,
  content: {
    date: Date
  },
};

export default function HistoryDate(props: Props) {
  const {
    history,
    historyDeleted,
    fieldsReplaced,
    newRequestHeadersSet,
    newRequestCookiesSet,
    newRequestBodySet,
    newRequestStreamsSet,
    newRequestFields,
    content
  } = props;

  function focusOnForm(event: any) {
    const composerUrlField: any = document.querySelector('.composer_url_input');
    composerUrlField.focus();
  }

  const current: any = history.find(
    (a: any) => a.date === content.date
  );
  let date: any = parse(current.date, 'MM/dd/yyyy', new Date());
  // let date = parseISO(current.date)
  if (isToday(date)) {
    date = 'Today';
  } // If the date matches todays date render the word "Today"
  else if (isYesterday(date)) {
    date = 'Yesterday';
  } else {
      date = format(date, 'MMM d, yyyy');
  }

  const histArray = current.history.map((history: [], i: number) => {
    return (
      <History
        key={i}  
        content={history}
        fieldsReplaced={fieldsReplaced}
        newRequestHeadersSet={newRequestHeadersSet}
        newRequestCookiesSet={newRequestCookiesSet}
        newRequestBodySet={newRequestBodySet}
        newRequestStreamsSet={newRequestStreamsSet}
        newRequestFields={newRequestFields}
      />
    );
  });

  return (
    <div>
      <h5 className="history-date" aria-label="queryDate">
        {date}
      </h5>
      {histArray}
      <hr />
    </div>
  );
}
