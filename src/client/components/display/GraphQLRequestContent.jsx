import React from 'react';
import CodeMirror from '@uiw/react-codemirror';

import ContentReqRow from './ContentReqRow';

function GraphQLRequestContent({ request }) {
  // ORGANIZE PROPS
  const { headers, cookies, body, bodyVariables, testContent } = request;

  // CREATE HEADER COMPONENTS
  const headerRows = headers.map((header, index) => (
    <ContentReqRow data={header} key={`h${index}`} />
  ));

  // CREATE COOKIE COMPONENTS
  const cookieRows = cookies.map((cookie, index) => (
    <ContentReqRow data={cookie} key={`h${index}`} />
  ));

  // PRETTY-PRINT JSON IN BODY
  const bodyText = body;

  // PRETTY-PRINT JSON IN VARIABLES
  const bodyVarText = bodyVariables;

  return (
    <div>
      {/* REQUEST DETAILS */}
      <div className="p-3">
        {/* HEADERS */}
        {headerRows.length > 0 && <div className="is-size-7">Headers</div>}
        {headerRows}
        {/* COOKIES */}
        {cookieRows.length > 0 && <div className="is-size-7">Cookies</div>}
        {cookieRows}
        {/* BODY */}
        <div>
          <div className="is-size-7">Body</div>
          <CodeMirror
            value={bodyText}
            options={{
              mode: 'application/json',
              theme: 'neo readonly',
              lineNumbers: true,
              tabSize: 4,
              lineWrapping: true,
              readOnly: true,
            }}
            height="200px"
          />
        </div>
        {/* VARIABLES */}
        {bodyVariables.length > 0 && (
          <div>
            <div className="is-size-7">Body Variables</div>
            <CodeMirror
              value={bodyVarText}
              options={{
                mode: 'application/json',
                theme: 'neo readonly',
                lineNumbers: true,
                tabSize: 4,
                lineWrapping: true,
                readOnly: true,
              }}
            />
          </div>
        )}
        {/* TEST DATA */}
        {testContent.length > 0 && (
          <div>
            <div className="is-size-7">Tests</div>
            <CodeMirror
              value={testContent}
              options={{
                mode: 'application/json',
                theme: 'neat readonly',
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

export default GraphQLRequestContent;
