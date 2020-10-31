import React, { useState } from 'react';

export default function CookieContainer({ cookie }) {

  const [showCookie, setShowCookie] = useState(false);

  const cookies = Object.entries(cookie).map(([key, value], index) => {
    if (!key || !value) return;
    if (showCookie === true && index > 1) {
      return (
        <tr key={index}>
          <td>{key}</td>
          <td>{value.toString()}</td>
        </tr>
      )
    } else if (index <= 1) {
      return (
        <tr key={index}>
          <td>{key}</td>
          <td className='table-value'>{value.toString()}</td>
        </tr>
      )
    } 
  }); 

  return (
     <table className="cookie-container table" onClick={()=>{setShowCookie(showCookie === false) }} >
        <thead>
          <tr className="is-size-7">
            <th>Key</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody className="is-size-7">
          {cookies}
        </tbody>
      </table> 
  )
}