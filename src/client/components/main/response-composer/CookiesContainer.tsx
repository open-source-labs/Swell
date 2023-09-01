import React from 'react';
import EmptyState from './EmptyState';
import CookieContainer from './CookieContainer';

interface CookiesContainerProps {
  currentResponse: {
    response?: {
      cookies?: Array<{
        [key: string]: any;
      }>;
    };
  };
}

export default function CookiesContainer({
  currentResponse,
}: CookiesContainerProps) {
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
