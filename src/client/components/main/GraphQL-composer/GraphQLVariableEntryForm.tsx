import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../toolkit-refactor/hooks';
import TextCodeArea from '../sharedComponents/TextCodeArea';
import { NewRequestBody, NewRequestBodySet } from '../../../../types';

interface GraphQLVariableEntryFormProps {
  newRequestBody: NewRequestBody;
  newRequestBodySet: NewRequestBodySet;
}

const GraphQLVariableEntryForm: React.FC<GraphQLVariableEntryFormProps> = ({
  newRequestBody: { bodyVariables, bodyIsNew },
  newRequestBody,
  newRequestBodySet,
}) => {
  const [cmValue, setValue] = useState(bodyVariables);

  // set a new value for codemirror only if loading from history or changing gQL type
  useEffect(() => {
    if (!bodyIsNew) setValue(bodyVariables);
  }, [bodyVariables, bodyIsNew]);

  const isDark = useAppSelector((store: any) => store.ui.isDark);

  return (
    <div>
      <div className="composer-section-title">Variables</div>
      <div className={`${isDark ? 'is-dark-400' : ''}`} id="gql-var-entry">
        <TextCodeArea
          mode="application/json"
          value={cmValue}
          placeholder="Variables must be JSON format"
          height="100px"
          onChange={(value: string) => {
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