import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {UnControlled as CodeMirror} from 'react-codemirror2';

import ContentReqRow from './ContentReqRow';

export default function RestRequestContent({ request }) {
  // const [showModal, setShowModal] = useState(false);
  // const dispatch = useDispatch();
  // PULL elements FROM store
  // const content = useSelector(store => store.business.content);
  console.log('RestRequestContent Props:',request);
  const { 
    method, // "POST"
    headers, // [{id: 0, active: true, key: 'key', value: 'value'}]
    cookies, // [{id: 0, active: true, key: 'key', value: 'value'}]
    body, // "body Content text"
    bodyType, // "raw"
    bodyVariables, // ""
    rawType, // "Text (text/plain)"
    isSSE, // false/true
    network, // "rest"
    restUrl, // "http://sdfgsdfgdsfg"
    wsUrl, // "ws://"
    gqlUrl, // "https://"
    grcpUrl // ""
  } = request;

  // CREATE HEADER COMPONENTS
  const headerRows = headers.map((header, index) => <ContentReqRow data={header} key={`h${index}`}/>);

  // CREATE COOKIE COMPONENTS
  const cookieRows = cookies.map((cookie, index) => <ContentReqRow data={cookie} key={`h${index}`}/>);

  return (
    <div>
      {/* REQUEST DETAILS */}
      <div className="p-3">
        {/* HEADERS */}
        {headerRows.length > 0 && 
          <div>Headers</div>
        }
        {headerRows}
        {/* COOKIES */}
        {cookieRows.length > 0 && 
          <div>Cookies</div>
        }
        {cookieRows}
        {/* BODY */}
        <div>Body</div>
        {/* FIGURE OUT CODEMIRROR!!!!!!!!!!!!!!!!!! */}
        {bodyType == 'Text (text/plain)' &&
        // we just want to show text, but maybe as codemirror still
          <div>BODY TYPE: RAW</div>
        }
        {rawType == 'application/json' &&
        // we want to show codemirror here
          <div>BODY TYPE: RAW</div>
        }
        {bodyType == '"application/javascript"' &&
          <div>BODY TYPE: RAW</div>
        }
        {bodyType == 'raw' &&
          <div>BODY TYPE: RAW</div>
        }
        {bodyType == 'raw' &&
          <div>BODY TYPE: RAW</div>
        }




        <CodeMirror
          value={body}
          options={{
            mode: 'application/json',
            theme: 'neo readonly',
            lineNumbers: true,
          }}
        />
      </div>
      {/* BUTTONS */}
      <div className="columns">
        <div className="column">Remove</div>
        <div className="column">Send</div>
      </div>

    </div>
  )
}