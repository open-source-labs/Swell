import React from 'react'

function ResponseSize({ currentResponse }) {
  // console.log('Console from Status Buttons ==> ', currentResponse)
  // currentResponse.response.headers.status

  if (!currentResponse ||
    !currentResponse.response ||
    !currentResponse.response.headers) 
  {
    return (null)
  }

  let length;
  if (currentResponse.response.headers["content-length"]) {
    length = "content-length"
  } else if (currentResponse.response.headers["Content-Length"]){
    length = "Content-Length"
  } else {
    return null;
  }

  // RECEIVING CONTENT-LENGTH AND CONVERTING INTO BYTES
  const conversionFigure = 1023.89427;
  const octetToByteConversion =   currentResponse.response.headers[`${length}`] / conversionFigure

  
  const size =  Math.round((octetToByteConversion + Number.EPSILON) * 100) / 100

    return (
        <div className='response-size-placement'>
          {`${size}kb`}
        </div>
        ) 
  }

export default ResponseSize
