import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../toolkit-refactor/hooks';
import { RootState } from '../../../toolkit-refactor/store';
import TextCodeArea from '../sharedComponents/TextCodeArea';

/**
 * renders entry form for TRPC request
 */

const TRPCBodyEntryForm = (props: any) => {
  const { newRequestBodySet } = props;
  const dispatch = useAppDispatch();
  const newRequestBody = useAppSelector(
    (store: RootState) => store.newRequest.newRequestBody
  );
  const { bodyContent } = newRequestBody;

  const isDark = useAppSelector((store: { ui: { isDark: boolean } }) => store.ui.isDark);
  const [cmValue, setValue] = useState(bodyContent);

  return (
    <div className="mt-3">
      <div className="composer-section-title">Body</div>
      <div id="gql-body-entry" className={`${isDark ? 'is-dark-400' : ''}`}>
        <TextCodeArea
          mode="application/json"
          value={cmValue}
          onChange={(value: string) => {
            dispatch(
              newRequestBodySet({
                ...newRequestBody,
                bodyContent: value,
                bodyIsNew: true,
              })
            );
          }}
        />
      </div>
    </div>
  );
};

export default TRPCBodyEntryForm;

