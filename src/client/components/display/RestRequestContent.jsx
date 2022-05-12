import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import ContentReqRow from './ContentReqRow';
import 'codemirror/theme/isotope.css';

export default function RestRequestContent({ request, isHTTP2 }) {
  // ORGANIZE PROPS
  const {
    headers, // [{id: 0, active: true, key: 'key', value: 'value'}]
    cookies, // [{id: 0, active: true, key: 'key', value: 'value'}]
    body, // "body Content text"
    bodyType, // "raw", x-www-form-urlencoded
    rawType, // "Text (text/plain)"
    isSSE,
    testContent, // false/true
  } = request;

  // CREATE HEADER COMPONENTS
  const headerRows = headers.map((header, index) => (
    <ContentReqRow data={header} key={`h${index}`} />
  ));

  // CREATE COOKIE COMPONENTS
  const cookieRows = cookies.map((cookie, index) => (
    <ContentReqRow data={cookie} key={`h${index}`} />
  ));

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
        value: decodeURIComponent(pair[1] || ''),
      };
      query.push(item);
    }
    return query;
  };
  let formRows = [];
  if (bodyType === 'x-www-form-urlencoded') {
    const parsedFormBody = parseQueryString(body);
    formRows = parsedFormBody.map((item, index) => (
      <ContentReqRow data={item} key={`h${index}`} />
    ));
  }

  // PRETTY-PRINT BODY IF JSON
  // const bodyText = body;
  const bodyText =
    rawType === 'application/json'
      ? JSON.stringify(JSON.parse(body), null, 4)
      : body;

  return (
    <div>
      {/* REQUEST DETAILS */}
      <div className="p-3">
        {/* SSE CONFIRMATION */}
        {isSSE && <div className="is-size-7">SSE</div>}
        {/* HTTP2 CONFIRMATION */}
        {isHTTP2 && (
          <div className="is-size-7 color-is-success">
            HTTP2 Connection Established
          </div>
        )}
        {/* HEADERS */}
        {headerRows.length > 0 && <div className="is-size-7">Headers</div>}
        {headerRows}
        {/* COOKIES */}
        {cookieRows.length > 0 && <div className="is-size-7">Cookies</div>}
        {cookieRows}
        {/* BODY */}
        {/* RAW DATA */}
        {body.length > 0 && bodyType === 'raw' && (
          <div>
            <div className="is-size-7">Body</div>
            <CodeMirror
              value={bodyText}
              options={{
                mode: rawType,
                theme: 'isotope',
                lineNumbers: true,
                tabSize: 4,
                lineWrapping: true,
                readOnly: true,
              }}
              height="200px"            
            />
          </div>
        )}
        {/* FORM DATA */}
        {bodyType === 'x-www-form-urlencoded' && (
          <div>
            <div className="is-size-7">Body</div>
            {formRows}
          </div>
        )}
        {/* TEST DATA */}
        {testContent.length > 0 && (
          <div>
            <div className="is-size-7">Tests</div>
            <CodeMirror
              value={testContent}
              options={{
                mode: rawType,
                theme: 'isotope',
                lineNumbers: true,
                tabSize: 4,
                lineWrapping: true,
                readOnly: true,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
