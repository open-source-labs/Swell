import React from "react";
import {UnControlled as CodeMirror} from 'react-codemirror2';

import ContentReqRow from './ContentReqRow';

export default function GRPCRequestContent({ request }) {
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
      GRPC CONTENT
    </div>
  )
}