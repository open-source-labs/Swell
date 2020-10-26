import React from 'react';
import ContentReqRow from '../display/ContentReqRow'

export default function HeadersContainer({ currentResponse }) {

  const responseHeaders = Object.entries(currentResponse.response.headers).map(([key, value], index) => {
    return (
      // <ContentReqRow data={{'key': key, 'value': value}} key={`r${index}`}/>
      <tr key={index}>
        <td>{key}</td>
        <td>{value}</td>
      </tr>
    );
  });

  return ( 
    <div className='mx-3'>
      <table className="table is-fullwidth">
        <thead className="is-size-7">
          <tr>
            <th>Key</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody className="is-size-7">
      {responseHeaders}
        </tbody>
      </table>
    </div>
  )
}