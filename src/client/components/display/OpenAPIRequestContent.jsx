import React from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import ContentReqRow from './ContentReqRow';

function OpenAPIRequestContent({ request }) {
  const {
    headers, // refers to meta-data in a GRPC request
    body, // "body Content text"
    rawType,
    testContent,
  } = request;

  // CREATE META-DATA COMPONENTS
  const metadataRows = headers.map((header, index) => (
    <ContentReqRow data={header} key={`h${index}`} />
  ));

  return (
    <div>
      {/* REQUEST DETAILS */}
      <div className="p-3">
        {/* METADATA */}
        {metadataRows.length > 0 && <div className="is-size-7">Metadata</div>}
        {metadataRows}
        {/* REQUEST / SERVICE */}
        <div className="is-size-7">Service / Request</div>
        <div className="is-flex">
          <input
            className="input"
            type="text"
            value={`Service: ${service}`}
            className="is-justify-content-center is-flex-grow-1 p-1"
            readOnly
          />
          <input
            className="input"
            type="text"
            value={`Request: ${rpc}`}
            className="is-justify-content-center is-flex-grow-1 p-1"
            readOnly
          />
        </div>
        {/* BODY */}
        <div>
          <div className="is-size-7">Body</div>
          <CodeMirror
            value={body}
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
        {testContent.length > 0 && (
          <div>
            <div className="is-size-7">Tests</div>
            <CodeMirror
              value={testContent}
              options={{
                mode: rawType,
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

export default OpenAPIRequestContent;
