/* eslint-disable no-new */
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { execute, subscribe } = require('graphql');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { createServer } = require('http');

const { PubSub } = require('graphql-subscriptions');
const bodyParser = require('body-parser');

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

const links = [
  {
    id: 'link-0',
    url: 'www.getswell.io',
    description: 'One-stop-shop for testing API endpoints',
  },
];

let idCount = links.length;

const resolvers = {
  Query: {
    feed: () => links,
  },
  Mutation: {
    post: (parent, args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      };
      console.log(link)
      links.push(link);
      pubsub.publish('NEW_LINK', { newLink: link });
      return link;
    },
  },
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

apolloServer.start().then(res => {
  apolloServer.applyMiddleware({ app });
})

const graphqlApp = ws.listen(PORT, () => {
  console.log(`GraphQL Server is now running on http://localhost:${PORT}`);

  const wsServer = new WebSocketServer({
    server: ws,
    path: '/graphql',
  })

  const serverCleanup = useServer({ schema }, wsServer);

});

module.exports = graphqlApp;
