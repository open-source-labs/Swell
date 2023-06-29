import React from 'react';
import TRPCPrceduresEndPoint from './TRPCPrceduresEndPoint';
export default function TRPCSubscriptionContainer(props) {
  const proceduresJSX = props.procedures.map((procedure, index) => {
    return (
      <TRPCPrceduresEndPoint
        proceduresDipatch={props.proceduresDipatch}
        index={index}
        key={index}
        procedureData={procedure}
      ></TRPCPrceduresEndPoint>
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
