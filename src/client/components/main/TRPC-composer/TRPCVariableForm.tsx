import React from 'react';
import TextCodeArea from '../sharedComponents/TextCodeArea';
import { useAppSelector } from '../../../rtk/store';

export default function TRPCVariableForm(props) {
  // input for for user to attach argument with their procedures
  const isDark = useAppSelector((state) => state.ui.isDark);

  const onChangeHandler = (string) => {
    // this function dispatch action to the main reducer function inside of trpc composer
    props.proceduresDipatch({
      type: 'VARIABLE',
      payload: { index: props.index, value: string },
    });
  };
  return (
    <div>
      <div id="gql-var-entry">
        <TextCodeArea
          mode="application/json"
          placeholder="Variable/s for this procedure(objects must be passed in as json format)"
          height="50px"
          value={props.procedureData.variable}
          onChange={onChangeHandler}
        />
      </div>
    </div>
  );
}

