import React from 'react';
import TextCodeArea from '../sharedComponents/TextCodeArea';
import { useSelector } from 'react-redux';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';

export default function TRPCVariableForm(props) {
  const isDark = useSelector((store: any) => store.ui.isDark);
  const onChangeHandler = (string) => {
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
