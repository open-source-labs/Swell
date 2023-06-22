import React from 'react';
import TRPCProcedure from './TRPCProcedure';
import SendRequestButton from '../sharedComponents/requestButtons/SendRequestButton';
export default function TRPCProceduresContainer(props) {
  const procedureJSX = props.procedures.map((procedure) => {
    const string = `method: ${procedure.method} &nbsp;; endpoint: ${procedure.endpoint}`;
    return (
      <li>
        method: {procedure.method} &nbsp; endpoint: {procedure.endpoint} &nbsp;
        variable: {procedure.variable}
      </li>
    );
  });
  return (
    <div>
      <TRPCProcedure></TRPCProcedure>
      <div>
        <h3 style={h3Styles}>Your Procedure/s</h3>
        {procedureJSX}
        <SendRequestButton onClick={props.sendRequest} />
      </div>
    </div>
  );
}

const h3Styles = {
  display: 'block',
  fontSize: '1.17em',
  fontWeight: 'bold',
};
