import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import TextCodeArea from './TextCodeArea';

const GraphQLVariableEntryForm = (props) => {
  const {
    newRequestBody: { bodyVariables },
    newRequestBody: { bodyIsNew },
    newRequestBody,
    newRequestBodySet,
  } = props;

  const [cmValue, setValue] = useState(bodyVariables);

  // set a new value for codemirror only if loading from history or changing gQL type
  useEffect(() => {
    if (!bodyIsNew) setValue(bodyVariables);
  }, [bodyVariables]);

  const isDark = useSelector((store) => store.ui.isDark);

  return (
    <div>
      <div className="composer-section-title">Variables</div>
      <div className={`${isDark ? 'is-dark-400' : ''}`} id="gql-var-entry">
        <TextCodeArea
          mode="application/json"
          value={cmValue}
          placeholder="Variables must be JSON format"
          height="100px"
          onChange={(value) => {
            setValue(value);
            newRequestBodySet({
              ...newRequestBody,
              bodyVariables: value,
              bodyIsNew: true,
            });
          }}
        />
      </div>
    </div>
  );
};

export default GraphQLVariableEntryForm;
