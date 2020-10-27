import React from 'react';
import EmptyState from '../display/EmptyState'

export default function HeadersContainer({ currentResponse }) {  

  if (!currentResponse.response) {
    return (
      <EmptyState />
    )
  } 

  const responseHeaders = Object.entries(currentResponse.response.headers).map(([key, value], index) => {
    return (
      <tr key={index}>
        <td>{key}</td>
        <td className="table-value">{value}</td>
      </tr>
    );
    }); 
  
 

  return ( 
    <div className='table-container mx-3'>
      <table className="table">
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