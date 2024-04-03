import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../toolkit-refactor/hooks';
import TextCodeArea from '../sharedComponents/TextCodeArea';
import { NewRequestBodySet } from '../../../../types';

interface Props {
  newRequestBody: {
    bodyContent: string;
    bodyIsNew: boolean;
  };
  newRequestBodySet: NewRequestBodySet;
  warningMessage: { body: string } | null;
  introspectionData: Record<string, any> | null;
}

const GraphQLBodyEntryForm: React.FC<Props> = (props) => {
  const {
    newRequestBody,
    newRequestBody: { bodyContent, bodyIsNew },
    newRequestBodySet,
    warningMessage,
    introspectionData,
  } = props;

  const [cmValue, setValue] = useState<string>(bodyContent);

  // set a new value for codemirror only if loading from history or changing query type
  useEffect(() => {
    if (!bodyIsNew) setValue(bodyContent);
  }, [bodyContent, bodyIsNew]);

  const isDark = useAppSelector((store: { ui: { isDark: boolean } }) => store.ui.isDark);

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
