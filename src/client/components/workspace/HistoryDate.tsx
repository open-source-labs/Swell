import React from 'react';
import { isYesterday, isToday, parseISO, parse, format } from 'date-fns';
import History from './History.tsx';

import {
  NewRequestStreams,
  NewRequestFields,
  NewRequestBodySet,
  NewRequestHeadersSet,
  NewRequestCookiesSet,
  ReqRes,
} from '~/types';
import { type HistoryItem } from '~/toolkit/slices/historySlice.ts';

interface Props {
  history: HistoryItem[];
  historyCleared: () => void;
  historyDeleted: (reqRes: ReqRes) => void;
  fieldsReplaced: (newField: NewRequestFields) => void;
  newRequestHeadersSet: NewRequestHeadersSet;
  newRequestCookiesSet: NewRequestCookiesSet;
  newRequestBodySet: NewRequestBodySet;
  newRequestStreamsSet: (newStream: NewRequestStreams) => void;
  newRequestFields: NewRequestFields;
  className: string;
  content: HistoryItem;
}

function calculateDateString(item: HistoryItem): string {
  const date = parse(item.date, 'MM/dd/yyyy', new Date());

  if (isToday(date)) {
    return 'Today';
  } else if (isYesterday(date)) {
    return 'Yesterday';
  } else {
    return format(date, 'MMM d, yyyy');
  }
}

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
    content,
  } = props;

  const current = history.find((a) => a.date === content.date);
  const date = current !== undefined ? calculateDateString(current) : null;

  return (
    <div>
      <h5 className="history-date" aria-label="queryDate">
        {date}
      </h5>

      {current?.history.map((history, i) => {
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
      })}
      <hr />
    </div>
  );
}
