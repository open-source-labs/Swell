import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../rtk/store';
import { newRequestBodySet } from '../../../rtk/slices/newRequestSlice';
import TextCodeArea from '~/components/main/sharedComponents/TextCodeArea';

type Props = {
  warningMessage: { body: string } | null;
  introspectionData: Record<string, any> | null;
};

const GraphQLBodyEntryForm = ({ warningMessage, introspectionData }: Props) => {
  const newBody = useAppSelector((store) => store.newRequest.newRequestBody);
  const isDark = useAppSelector((store) => store.ui.isDark);
  const dispatch = useAppDispatch();

  /**
   * @todo useEffect should not be used for syncing different state values that
   * all exist inside React. This useEffect call should be removed in favor of
   * another approach (render keys, no state at all, etc.)
   */
  const [codeMirrorValue, setCodeMirrorValue] = useState(newBody.bodyContent);
  useEffect(() => {
    if (!newBody.bodyIsNew) {
      setCodeMirrorValue(newBody.bodyContent);
    }
  }, [newBody]);

  return (
    <div className="mt-3">
      {warningMessage !== null && <div>{warningMessage.body}</div>}

      <div className="composer-section-title">Body</div>
      <div id="gql-body-entry" className={`${isDark ? 'is-dark-400' : ''}`}>
        <TextCodeArea
          mode="application/json"
          value={codeMirrorValue}
          onChange={(bodyContent) => {
            dispatch(
              newRequestBodySet({
                ...newBody,
                bodyContent,
                bodyIsNew: true,
              })
            );
          }}
        />
      </div>
    </div>
  );
};

export default GraphQLBodyEntryForm;
