import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../toolkit-refactor/store';


/**
 * renders entry form for TRPC request
 */
const TRPCBodyEntryForm = (props : any) => {


  const {
    newRequestBodySet,
  } = props;
  const dispatch = useDispatch();
  const newRequestBody = useSelector((store: RootState) => store.newRequest.newRequestBody)
  const { bodyContent, bodyIsNew } = newRequestBody

  const isDark = useSelector((store: RootState) => store.ui.isDark);
  const [cmValue, setValue] = useState(bodyContent);



  return (
    <div className="mt-3">
      <div className="composer-section-title">Body</div>
      <div
        id="gql-body-entry"
        className={`${isDark ? 'is-dark-400' : ''}is-neutral-200-box p-3`}
      >
        <CodeMirror
          value={cmValue}
          theme="dark"
          height="200px"
          width="100%"
          maxHeight="300px"
          onChange={(value, viewUpdate) => {
            dispatch(newRequestBodySet({
              ...newRequestBody,
              bodyContent: value,
              bodyIsNew: true,
            }));
          }}
        />
      </div>
    </div>
  );
};

export default TRPCBodyEntryForm;
