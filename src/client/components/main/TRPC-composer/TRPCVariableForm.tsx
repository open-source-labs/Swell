import React from 'react';
import TextCodeArea from '../sharedComponents/TextCodeArea';
import { useSelector } from 'react-redux';

export default function TRPCVariableForm() {
  const isDark = useSelector((store: any) => store.ui.isDark);
  const onChangeHandler = (value: string) => {};
  return (
    <div>
      <div id="gql-var-entry">
        <TextCodeArea
          mode="application/json"
          placeholder="Variable/s for this procedure(must be JSON format)"
          height="50px"
          onChange={onChangeHandler}
        />
      </div>
    </div>
  );
}
