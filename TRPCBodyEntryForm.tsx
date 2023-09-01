/**
 * @file Renders entry form for an incoming tRPC request
 */
import React from 'react';
import { useAppSelector, useAppDispatch } from './src/client/rtk/store';
import { newRequestBodySet } from './src/client/rtk/slices/newRequestSlice';
import TextCodeArea from './src/client/components/main/sharedComponents/TextCodeArea';

const TRPCBodyEntryForm = () => {
  const isDark = useAppSelector((store) => store.ui.isDark);
  const newBody = useAppSelector((store) => store.newRequest.newRequestBody);
  const dispatch = useAppDispatch();

  return (
    <div className="mt-3">
      <div className="composer-section-title">Body</div>
      <div id="gql-body-entry" className={`${isDark ? 'is-dark-400' : ''}`}>
        <TextCodeArea
          mode="application/json"
          value={newBody.bodyContent}
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

export default TRPCBodyEntryForm;

