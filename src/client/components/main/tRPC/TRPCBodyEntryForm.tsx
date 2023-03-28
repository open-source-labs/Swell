import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NewRequestBody } from '../../../../types';
import { RootState } from '../../../toolkit-refactor/store';
import TextCodeArea from '../new-request/TextCodeArea';

/**
 * renders entry form for TRPC request
 */
const TRPCBodyEntryForm = (props: any) => {
  const { newRequestBodySet } = props;
  const dispatch = useDispatch();
  const newRequestBody = useSelector(
    (store: RootState) => store.newRequest.newRequestBody
  );
  const { bodyContent } = newRequestBody;

  const isDark = useSelector((store: RootState) => store.ui.isDark);
  const [cmValue, setValue] = useState(bodyContent);

  return (
    <div className="mt-3">
      <div className="composer-section-title">Body</div>
      <div
        id="gql-body-entry"
        className={`${isDark ? 'is-dark-400' : ''}is-neutral-200-box p-3`}
      >
        <TextCodeArea
          mode="application/json"
          value={cmValue}
          onChange={(value: NewRequestBody) => {
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

