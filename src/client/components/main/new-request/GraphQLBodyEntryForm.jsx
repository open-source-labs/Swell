import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import TextCodeArea from './TextCodeArea';

const GraphQLBodyEntryForm = (props) => {
  const {
    newRequestBody,
    newRequestBody: { bodyContent },
    newRequestBody: { bodyIsNew },
    newRequestBodySet,
    warningMessage,
    introspectionData,
  } = props;

  const [cmValue, setValue] = useState(bodyContent);

  // set a new value for codemirror only if loading from history or changing query type
  useEffect(() => {
    if (!bodyIsNew) setValue(bodyContent);
  }, [bodyContent]);

  const isDark = useSelector((store) => store.ui.isDark);

  return (
    <div className="mt-3">
      {
        // conditionally render warning message
        warningMessage ? <div>{warningMessage.body}</div> : null
      }
      <div className="composer-section-title">Body</div>
      <div id="gql-body-entry" className={`${isDark ? 'is-dark-400' : ''}`}>
        <TextCodeArea
          mode="application/json"
          value={cmValue}
          onChange={(value) => {
            newRequestBodySet({
              ...newRequestBody,
              bodyContent: value,
              bodyIsNew: true,
            });
          }}
        />
      </div>
    </div>
  );
};

export default GraphQLBodyEntryForm;
