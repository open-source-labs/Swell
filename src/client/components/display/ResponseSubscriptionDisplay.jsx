import React from 'react';
import JSONPretty from 'react-json-pretty';
import gql from 'graphql-tag';
import { ApolloProvider, Subscription } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';


const ResponseSubscriptionDisplay = ({ content, reqResUpdate }) => {
  let { body, bodyVariables } = content.request;
  if (bodyVariables === '') bodyVariables = null
  const uri = /wss?:\/\//.test(content.protocol) ? content.url : content.url.replace(content.protocol, 'ws://');

  const link = new WebSocketLink({
    uri,
    options: { reconnect: true }
  });

  const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });

  const theme = {
    main: 'line-height:1.3; color: midnightblue; background:#RRGGBB; overflow:auto;',
    key: 'color:#0089D0;', // bluetwo
    string: 'color:#15B78F;',// greenone
    value: 'color:#fd971f;', // a nice orange
    boolean: 'color:#E00198;', // gqlpink
  }

  return (
      <div className="tab_content-response">
        <div className="json-response" key="jsonresponsediv">
  {content.response.events.reduce((array, subEvent, index) => array.concat([<JSONPretty data={subEvent} space="4" theme={theme} key={`subs${index}`} />, <hr key={`hr${index}`}></hr>]), [])}
        </div>
      </div>
  );
}

export default ResponseSubscriptionDisplay;
