import React from 'react';
import JSONPretty from 'react-json-pretty';
import { Subscription } from 'react-apollo';
import gql from 'graphql-tag';

import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';


const ResponseSubscriptionDisplay = ({ subscriptionBody }) => {

  const httpLink = createHttpLink({ uri: 'http://localhost:4000' });

  const wsLink = new WebSocketLink({
    uri: 'ws://localhost:4000',
    options: { reconnect: true }
  });

  const link = split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    httpLink
  )

  const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client} >
      <div className="tab_content-response">
        <Subscription subscription={gql`${subscriptionBody}`}>
          {({ loading, data }) => {
            if (loading) return <p>Listening for new data</p>;
            return <div className="json-response" key="jsonresponsediv">
              <JSONPretty data={data} space="4" theme={{
                main: 'line-height:1.3; color: midnightblue; background:#RRGGBB; overflow:auto;',
                key: 'color:#0089D0;', // bluetwo
                string: 'color:#15B78F;',// greenone
                value: 'color:#fd971f;', // a nice orange
                boolean: 'color:#E00198;', // gqlpink
              }}
              />
            </div>
          }}
        </Subscription>
      </div>
    </ApolloProvider >
  );


}

export default ResponseSubscriptionDisplay;
