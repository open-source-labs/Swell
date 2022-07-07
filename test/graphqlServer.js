/* eslint-disable no-new */
/**
 * @file This is mock server for GraphQL
 * tested query, mutation, and subcription and confrimed its working fine
 */
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { execute, subscribe } = require('graphql');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { createServer } = require('http');

const { PubSub } = require('graphql-subscriptions');
const bodyParser = require('body-parser');

// websocket is reqquired for subscription
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');

const { server } = require('websocket');

const PORT = 4000;

const app = express();
const ws = createServer(app);

const pubsub = new PubSub();

const typeDefs = `
	type Query {
		feed: [Link!]!
		link(id: ID!): Link
	}

	type Mutation {
		post(url: String!, description: String!): Link!
	}

	type Subscription {
		newLink: Link
	}

	type Link {
		id: ID!
		description: String!
		url: String!
	}
`;

//first time, sending a query request should get response of link data below ('www.getswell.io')
const links = [
  {
    id: 'link-0',
    url: 'www.getswell.io',
    description: 'One-stop-shop for testing API endpoints',
  },
];

let idCount = links.length;

const resolvers = {
  // similar to GET request -> display
  Query: {
    feed: () => links,
  },
  // with Mutation, send post request -> adding new data
  Mutation: {
    post: (parent, args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      };
      console.log(link);
      links.push(link);
      pubsub.publish('NEW_LINK', { newLink: link });
      return link;
    },
  },
  // subscription will listen to the server and everytime there's new update, server will send a new link to client
  // if subscription worked, should console log 'subscribed' in terminal
  Subscription: {
    newLink: {
      // create a subscription resolver function
      subscribe: () => {
        console.log('subscribed');
        return pubsub.asyncIterator('NEW_LINK');
      }, // subscribe to changes in a topic
    },
  },
  Link: {
    id: (parent) => parent.id,
    description: (parent) => parent.description,
    url: (parent) => parent.url,
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

app.use('/graphql', bodyParser.json());

// create Apollo Server
let apolloServer = new ApolloServer({
  schema,
  plugins: [
    // Proper shutdown for the WebSoket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

apolloServer.start().then((res) => {
  apolloServer.applyMiddleware({ app });
});

// listening to 4000
const graphqlApp = ws.listen(PORT, () => {
  console.log(`GraphQL Server is now running on http://localhost:${PORT}`);

  const wsServer = new WebSocketServer({
    server: ws,
    path: '/graphql',
  });

  const serverCleanup = useServer({ schema }, wsServer);
});

module.exports = graphqlApp;
