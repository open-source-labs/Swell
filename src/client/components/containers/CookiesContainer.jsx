import React from 'react';
import CookieContainer from './CookieContainer';
import EmptyState from '../display/EmptyState';

function CookiesContainer({ currentResponse }) {
  if (
    !currentResponse.response ||
    !currentResponse.response.cookies ||
    !currentResponse.response.cookies.length
  ) {
    return <EmptyState />;
  }

  const responseCookies = currentResponse.response.cookies.map(
    (cookie, index) => {
      return (
        <CookieContainer
          className="cookies-container extended"
          key={index}
          cookie={cookie}
        />
      );
    }
  );

  return <div className="mx-3">{responseCookies}</div>;
}

export default CookiesContainer;
