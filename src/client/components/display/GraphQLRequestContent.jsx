import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';

export default function GraphQLRequestContent({ request }) {
  // const [showModal, setShowModal] = useState(false);
  // const dispatch = useDispatch();
  // PULL elements FROM store
  // const content = useSelector(store => store.business.content);
  console.log("RestRequestContent:",request);

  const { 
    method, // "POST"
    headers, // [{id: 0, active: true, key: 'key', value: 'value'}]
    cookies, // [{id: 0, active: true, key: 'key', value: 'value'}]
    body, // "body Content text"
    bodyType, // "raw", x-www-form-urlencoded
    bodyVariables, // ""
    rawType, // "Text (text/plain)"
    // rawType Options: 
    // Text (text/plain)
    // text/plain
    // application/json
    // application/javascript
    // application/xml
    // text/html
    // text/xml
    // raw
    isSSE, // false/true
    network, // "rest"
    restUrl, // "http://sdfgsdfgdsfg"
    wsUrl, // "ws://"
    gqlUrl, // "https://"
    grcpUrl // ""
  } = request;


  return (
    <div>
      GRAPHQL CONTENT
    </div>
  )
}