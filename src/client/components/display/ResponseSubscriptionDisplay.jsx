import React from 'react';
import JSONPretty from 'react-json-pretty';
import gql from 'graphql-tag';
import { ApolloProvider, Subscription } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';


const ResponseSubscriptionDisplay = ({ subscriptionData }) => {
  const { body, uri } = subscriptionData;

  const link = new WebSocketLink({
    uri,
    options: { reconnect: true }
  });

  const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client} >
      <div className="tab_content-response">
        <div className="json-response" key="jsonresponsediv">
          <Subscription subscription={gql`${body}`}>
            {({ loading, data }) => {
              if (loading) return 'Listening for new data';
              return <JSONPretty data={data} space="4" theme={{
                main: 'line-height:1.3; color: midnightblue; background:#RRGGBB; overflow:auto;',
                key: 'color:#0089D0;', // bluetwo
                string: 'color:#15B78F;',// greenone
                value: 'color:#fd971f;', // a nice orange
                boolean: 'color:#E00198;', // gqlpink
              }}
              />
            }}
          </Subscription>
        </div>
      </div>
    </ApolloProvider >
  );
}

export default ResponseSubscriptionDisplay;
