import React from 'react'

function ResponseTime({ currentResponse }) {
  // console.log('Console from Status Buttons ==> ', currentResponse)
  // currentResponse.response.headers.status

  
  if (!currentResponse ||
    !currentResponse.timeReceived ||
    !currentResponse.timeSent
  ){ 
    return (null)
  }
  

  // RECEIVING STATUS CODE AND CONVERTING INTO STRING
  const responseTime = currentResponse.timeReceived - currentResponse.timeSent;

    return (
        <div className='response-time-placement'>
          {`${responseTime}ms`}
        </div>
    )
  }

export default ResponseTime
