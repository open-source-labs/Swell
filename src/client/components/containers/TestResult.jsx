import React, { useEffect } from 'react'

export default function TestResult({ result, message }) {

  let testColor;
  if (result === 'Pass') testColor = 'success';
  else testColor = 'danger';

  return (
    <div>
      <span style={{width: '20px', padding: '10px'}} className={`has-background-${testColor} cards-titlebar p-1 mt-2 has-text-centered`}>{result}</span> <span className='mx-2'>{message}</span>
    </div>
  )
}
