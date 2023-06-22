import React, { useState } from 'react';
import TRPCVariableForm from './TRPCVariableForm';
import TRPCPrceduresEndPoint from './TRPCPrceduresEndPoint';

export default function TRPCProcedure() {
  const [procedureType, setProcedureType] = useState('QUERRY');
  const [endpoint, setEndpoint] = useState('');
  const setProcedureTypeHandler = (type) => {
    setProcedureType(type);
  };
  const endPointChangeHandler = (userEndpoint) => {
    setEndpoint(userEndpoint);
  };
  return (
    <div>
      <TRPCPrceduresEndPoint
        procedureType={procedureType}
        setProcedureTypeHandler={setProcedureTypeHandler}
        endpoint={endpoint}
        endPointChangeHandler={endPointChangeHandler}
      ></TRPCPrceduresEndPoint>
      <TRPCVariableForm></TRPCVariableForm>
    </div>
  );
}
