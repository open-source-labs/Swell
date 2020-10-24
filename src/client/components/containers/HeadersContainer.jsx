import React from 'react';

export default function HeadersContainer(props) {
  console.log('props from headers -=--> ', props)
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
          <tr>
            <td>content-type</td>
            <td>application/json</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}