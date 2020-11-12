import React from "react";
import {UnControlled as CodeMirror} from 'react-codemirror2';

import ContentReqRow from './ContentReqRow';


export default function GraphQLRequestContent({ request }) {

  // ORGANIZE PROPS
  const { 
    headers,
    cookies,
    body,
    bodyVariables,
  } = request;

  // CREATE HEADER COMPONENTS
  const headerRows = headers.map((header, index) => <ContentReqRow data={header} key={`h${index}`}/>);

  // CREATE COOKIE COMPONENTS
  const cookieRows = cookies.map((cookie, index) => <ContentReqRow data={cookie} key={`h${index}`}/>);

  // PRETTY-PRINT JSON IN BODY
  const bodyText = body;
  // const bodyText = ( JSON.stringify( JSON.parse(body), null, 4 ) );
  // PRETTY-PRINT JSON IN VARIABLES
  const bodyVarText = bodyVariables;
  // const bodyVarText = ( JSON.stringify( JSON.parse(bodyVariables), null, 4 ) );

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
            />
        </div>
        {/* VARIABLES */}
          {bodyVariables.length > 0 &&
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
          }
      </div>
    </div>
  )
}