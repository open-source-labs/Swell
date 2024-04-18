import React, { useState } from 'react';
import TRPCVariableForm from './TRPCVariableForm';
import TRPCPrceduresEndPoint from './TRPCPrceduresEndPoint';

export default function TRPCProcedure(props) {
  //renders each procedure
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
  padding: '10px 0px',
};

