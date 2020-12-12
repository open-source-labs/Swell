import React, { useEffect } from 'react'

export default function TestResult({ status, message }) {

  let testColor;
  if (status === 'PASS') testColor = 'success';
  else testColor = 'danger';

  return (
    // Need to add in relative padding.
    <div style={{padding: '8px', display: 'flex', justifyContent: 'start'}}>
      <div style={{minWidth: '50px', height: '30px'}} className={`has-background-${testColor} cards-titlebar has-text-centered`}>{status}</div> <div className='mx-2'>{message}</div>
    </div>
  )
}
