import React, { useState } from 'react';
import TRPCVariableForm from './TRPCVariableForm';
import TRPCPrceduresEndPoint from './TRPCPrceduresEndPoint';

export default function TRPCProcedure(props) {
  return (
    <div style={container}>
      <TRPCPrceduresEndPoint
        procedureData={props.procedureData}
        proceduresDipatch={props.proceduresDipatch}
        index={props.index}
      ></TRPCPrceduresEndPoint>

      <TRPCVariableForm
        procedureData={props.procedureData}
        proceduresDipatch={props.proceduresDipatch}
        index={props.index}
      ></TRPCVariableForm>
    </div>
  );
}

const container = {
  border: '1px solid black',
  padding: '10px 0px',
};
