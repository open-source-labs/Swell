import React, { useState, useEffect } from 'react';
import { useAppSelector } from '~/toolkit/store';
import { newRequestBodySet } from '~/toolkit/slices/newRequestSlice';
import TextCodeArea from '../sharedComponents/TextCodeArea';

const GraphQLVariableEntryForm = () => {
  const newBody = useAppSelector((store) => store.newRequest.newRequestBody);
  const isDark = useAppSelector((store) => store.ui.isDark);

  /**
   * @todo useEffect should not be used for syncing different state values that
   * all exist inside React. This useEffect call should be removed in favor of
   * another approach (render keys, no state at all, etc.)
   */
  const [codeMirrorValue, setCodeMirrorValue] = useState(newBody.bodyVariables);
  useEffect(() => {
    if (!newBody.bodyIsNew) {
      setCodeMirrorValue(newBody.bodyVariables);
    }
  }, [newBody]);

  return (
    <div>
      <div className="composer-section-title">Variables</div>
      <div className={`${isDark ? 'is-dark-400' : ''}`} id="gql-var-entry">
        <TextCodeArea
          mode="application/json"
          value={codeMirrorValue}
          placeholder="Variables must be JSON format"
          height="100px"
          onChange={(bodyVariables: string) => {
            setCodeMirrorValue(bodyVariables);
            newRequestBodySet({
              ...newBody,
              bodyVariables,
              bodyIsNew: true,
            });
          }}
        />
      </div>
    </div>
  );
};

export default GraphQLVariableEntryForm;
