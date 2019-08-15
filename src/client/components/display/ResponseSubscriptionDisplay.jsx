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
    <ApolloProvider client={client} >
      <div className="tab_content-response">
        <div className="json-response" key="jsonresponsediv">
          {content.connection === 'closed' && <JSONPretty data={content.response.events[0]} space="4" theme={theme} />}
          {content.connection === 'open' && <Subscription subscription={gql`${body}`} variables={JSON.parse(bodyVariables)}>
            {({ loading, data }) => {
              if (loading && !content.response.events[0]) return 'Listening for new data';
              if (loading && content.response.events[0]) return <JSONPretty data={content.response.events[0]} space="4" theme={theme} />
              content.response.events[0] = data;
              reqResUpdate(content);
              return <JSONPretty data={data} space="4" theme={theme} />
            }}
          </Subscription>}
        </div>
      </div>
    </ApolloProvider >
  );
}

export default ResponseSubscriptionDisplay;
