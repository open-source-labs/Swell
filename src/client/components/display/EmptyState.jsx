import React from 'react'
import logofaded from '../../../assets/img/swell-logo-faded.png'

function EmptyState({ connection }) {
  console.log('cr',connection);
  return (
    <div className='empty-state-wrapper'>
      {connection !== 'closed' &&
        (<img className='empty-state-img' src={logofaded} alt='faded-logo'/>)
      }
      {connection === 'closed' && 
        (<div className="response-loading" />)
      }
    </div>
  )
}

export default EmptyState
