import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {UnControlled as CodeMirror} from 'react-codemirror2';

import ContentReqRow from './ContentReqRow';

export default function RestRequestContent({ request }) {
  // const dispatch = useDispatch();
  // PULL elements FROM store
  // const content = useSelector(store => store.business.content);
  
  const { 
    method, // "POST"
    headers, // [{id: 0, active: true, key: 'key', value: 'value'}]
    cookies, // [{id: 0, active: true, key: 'key', value: 'value'}]
    body, // "body Content text"
    bodyType, // "raw", x-www-form-urlencoded
    bodyVariables, // ""
    rawType, // "Text (text/plain)"
    // rawType Options: 
    // Text (text/plain)
    // text/plain
    // application/json
    // application/javascript
    // application/xml
    // text/html
    // text/xml
    // raw
    isSSE, // false/true
    network, // "rest"
    restUrl, // "http://sdfgsdfgdsfg"
    wsUrl, // "ws://"
    gqlUrl, // "https://"
    grcpUrl // ""
  } = request;
  
  // const [bodyText, setBodyText] = useState(body);


  // CREATE HEADER COMPONENTS
  const headerRows = headers.map((header, index) => <ContentReqRow data={header} key={`h${index}`}/>);

  // CREATE COOKIE COMPONENTS
  const cookieRows = cookies.map((cookie, index) => <ContentReqRow data={cookie} key={`h${index}`}/>);

  // CREATE FORM DATA BODY COMPONENTS
  // body = key1=value1&key2=value2
  const parseQueryString = (string) => {
    // input: key1=value1&key2=value2
    // output: [ {id: 1, key: key1, value: value1 ...etc } ]
    const query = [];
    let pairs = (string[0] === '?' ? string.substr(1) : string).split('&');
    for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i].split('=');
        const item = {
          id: i,
          key: decodeURIComponent(pair[0]),
          value: decodeURIComponent(pair[1] || '')
        };
        query.push(item);
    }
    return query;
  }
  let formRows = [];
  if (bodyType === "x-www-form-urlencoded") {
    const parsedFormBody = parseQueryString(body);
    formRows = parsedFormBody.map((item, index) => <ContentReqRow data={item} key={`h${index}`}/>);
  }

  // PRETTY-PRINT JSON
  let bodyText = body;
  if(rawType === 'application/json') {
    bodyText = ( 
      JSON.stringify(
        JSON.parse(bodyText),
        null,
        4
      ) 
    );
  }

  return (
    <div>
      {/* REQUEST DETAILS */}
      <div className="p-3">
        {/* HEADERS */}
        {headerRows.length > 0 && 
          <div className="is-size-7">Headers</div>
        }
        {headerRows}
        {/* COOKIES */}
        {cookieRows.length > 0 && 
          <div className="is-size-7">Cookies</div>
        }
        {cookieRows}
        {/* BODY */}
          {/* RAW DATA */}
          {body.length > 0 && bodyType === "raw" &&
            <div>
              <div className="is-size-7">Body</div>
              <CodeMirror
                value={bodyText}
                options={{
                  mode: {rawType},
                  theme: 'neo readonly',
                  lineNumbers: true,
                  tabSize: 4,
                  lineWrapping: true,
                  readOnly: true,
                }}
                />
            </div>
          }
          {/* FORM DATA */}
          {bodyType === "x-www-form-urlencoded" &&
            <div>
              <div className="is-size-7">Body</div>
              {formRows}
            </div>
          }
        {/* SSE CONFIRMATION */}
        { isSSE && 
          <div className="is-size-7"> 
            SSE: true
          </div>
        }
      </div>
    </div>
  )
}