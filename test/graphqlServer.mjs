/**
 * @file This is mock server for GraphQL
 * tested query, mutation, and subcription and confrimed its working fine
 *
 * NOTE:
 * Apollo server 4 requires top-level async/await for the server to start properly,
 * which can only be done in a module. Since most backend logic in Swell uses
 * CommonJS, we need to change this file to `.mjs` to make things work.
 * The downside to making this as a `.mjs` file is that it would not be automatically
 * compatible with the rest of the backend code that uses CommonJS.
 * Since this is only for testing and as a standalone server, we should not need
 * to configure the bundler to accept both. If you do, you may need to research
 * on how to do so in webpack.
 *
 * Apollo server reference: https://www.apollographql.com/docs/apollo-server/data/subscriptions/
 */
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { createServer } from 'http';
import express from 'express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import bodyParser from 'body-parser';
import cors from 'cors';
import { PubSub } from 'graphql-subscriptions';

const PORT = 4000;
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

// Create the schema, which will be used separately by ApolloServer and
// the WebSocket server.
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Create an Express app and HTTP server; we will attach both the WebSocket
// server and the ApolloServer to this HTTP server.
const app = express();
const httpServer = createServer(app);

// Create our WebSocket server using the HTTP server we just set up.
const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});
// Save the returned server's info so we can shutdown this server later
const serverCleanup = useServer({ schema }, wsServer);

// Set up ApolloServer.
const server = new ApolloServer({
  schema,
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server.
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

await server.start();
app.use('/graphql', cors(), bodyParser.json(), expressMiddleware(server));

// Now that our HTTP server is fully set up, we can listen to it.
httpServer.listen(PORT, () => {
  console.log(`GraphQL Test Server: listening on PORT ${PORT}`);
});
