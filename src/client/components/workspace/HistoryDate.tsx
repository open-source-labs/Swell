import React, { Component } from 'react';
import { isYesterday, isToday, parseISO, parse, format } from 'date-fns';
import History from './History.tsx';

import {
  NewRequestBody, 
  CookieOrHeader, 
  NewRequestStreams, 
  NewRequestFields } from '../../../types'

interface NewRequestCookiesSet {
  cookiesArr: CookieOrHeader[];
  count: number;
};

interface NewRequestHeadersSet {
headersArr: CookieOrHeader[];
count: number;
};

interface Props {
  history: object[],
  historyCleared: () => void,
  historyDeleted: string,
  fieldsReplaced: (obj: {}) => void,
  newRequestHeadersSet: (obj: NewRequestHeadersSet) => void,
  newRequestCookiesSet: (obj: NewRequestCookiesSet) => void,
  newRequestBodySet: (obj: NewRequestBody) => void,
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
        content={history}
        key={i}
        focusOnForm={focusOnForm}
        historyDeleted={historyDeleted}
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

// import React, { Component } from 'react';
// import { isYesterday, isToday, parseISO, parse, format } from 'date-fns';
// import History from './History.jsx';

// class HistoryDate extends Component {
//   constructor(props) {
//     super(props);
//     this.focusOnForm = this.focusOnForm.bind(this);
//   }

//   focusOnForm(event) {
//     const composerUrlField = document.querySelector('.composer_url_input');
//     composerUrlField.focus();
//   }

//   render() {
//     const current = this.props.history.find(
//       (a) => a.date === this.props.content.date
//     );
//     let date = parse(current.date, 'MM/dd/yyyy', new Date());
//     // let date = parseISO(current.date)
//     if (isToday(date)) {
//       date = 'Today';
//     } // If the date matches todays date render the word "Today"
//     else if (isYesterday(date)) {
//       date = 'Yesterday';
//     } else {
//       date = format(date, 'MMM d, yyyy');
//     }

//     const histArray = current.history.map((history, i) => {
//       return (
//         <History
//           content={history}
//           key={i}
//           focusOnForm={this.focusOnForm}
//           historyDeleted={this.props.historyDeleted}
//           fieldsReplaced={this.props.fieldsReplaced}
//           newRequestHeadersSet={this.props.newRequestHeadersSet}
//           newRequestCookiesSet={this.props.newRequestCookiesSet}
//           newRequestBodySet={this.props.newRequestBodySet}
//           newRequestStreamsSet={this.props.newRequestStreamsSet}
//           newRequestFields={this.props.newRequestFields}
//         />
//       );
//     });

//     return (
//       <div>
//         <h5 className="history-date" aria-label="queryDate">
//           {date}
//           <button>HISTORYDATEHEREIMPORTANT!!!!!!!</button>
//         </h5>
//         {histArray}
//         <hr />
//       </div>
//     );
//   }
// }

// export default HistoryDate;
