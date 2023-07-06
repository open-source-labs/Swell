import React from 'react';
import TRPCProcedure from './TRPCProcedure';

export default function TRPCProceduresContainer(props) {
  //renders all of the procedures inside the procedures array
  const proceduresJSX = props.procedures.map((procedure, index) => {
    return (
      <TRPCProcedure
        proceduresDipatch={props.proceduresDipatch}
        index={index}
        key={index}
        procedureData={procedure}
      ></TRPCProcedure>
    );
  });
  return (
    <div>
      <h3 style={h3Styles}>Your Procedure/s</h3>
      {proceduresJSX}
    </div>
  );
}

const h3Styles = {
  display: 'block',
  fontSize: '1.17em',
  fontWeight: 'bold',
};

