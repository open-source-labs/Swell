import React from 'react';

export default function TestResult({ id, status, message }) {
  const testColor = status === 'PASS' ? 'success'  : 'danger';

  return (
    <div style={{padding: '8px', display: 'flex', justifyContent: 'start'}}>
      <div 
        style={{minWidth: '50px', height: '30px', justifyItems: 'center'}}
        className={`has-background-${testColor} cards-titlebar has-text-centered`}
        id={`${id}-status`}>
        {status}
      </div> 
      <div id={`${id}-message`} className='mx-2'>
        {message}
      </div>
    </div>
  );
}
