import React from 'react';
import CookieContainer from './CookieContainer'

export default function CookiesContainer({ currentResponse }) {

  const responseCookies = currentResponse.response.cookies.map((cookie, index) => {

    

    return (
       <CookieContainer key={index} cookie={cookie} />
    )
  })

  return (
  <div className='mx-3'>
      {responseCookies}
    </div>
  )
}