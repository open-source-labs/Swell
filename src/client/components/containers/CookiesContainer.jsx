import React from 'react';

export default function CookiesContainer({ currentResponse }) {

  const responseHeaders = Object.entries(currentResponse.response.cookies[0]).map(([key, value], index) => {
    console.log({key}, {value})
    return (
      <tr key={index}>
        <td>{key}</td>
        <td>{value.toString()}</td>
      </tr>
    )
  })

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