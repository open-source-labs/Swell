import React from 'react';

export default function OpenAPIRequestContent({ request, isHTTP2 }) {
  console.log(request);
  return <div>this is {request.network}</div>;
}
