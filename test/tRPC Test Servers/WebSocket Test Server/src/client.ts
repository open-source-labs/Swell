import {
  createTRPCProxyClient,
  createWSClient,
  httpLink,
  splitLink,
  wsLink,
} from '@trpc/client';
import fetch from 'node-fetch';
import ws from 'ws';
import type { AppRouter } from './server';




// polyfill fetch & websocket
const globalAny = global as any;
globalAny.fetch = fetch;
globalAny.WebSocket = ws;

const wsClient = createWSClient({
  url: `ws://localhost:2022`,
});
const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    // call subscriptions through websockets and the rest over http
    splitLink({
      condition(op) {
        return op.type === 'subscription';
      },
      true: wsLink({
        client: wsClient,
      }),
      false: httpLink({
        url: `http://localhost:2022`,
      }),
    }),
  ],
});

// async function main() {
  // const helloResponse = await trpc.greeting.hello.query({
  //   name: 'world',
  // })

  // console.log('helloResponse', helloResponse);

  // const createPostRes = await trpc.post.createPost.mutate({
  //   title: 'hello world',
  //   text: 'check out https://tRPC.io',
  // });
  // console.log('createPostResponse', createPostRes);

  let count = 0;
  async function main() {
    let count = 0;
  await new Promise((resolve) => {
    const subscription = client.post.randomNumber.subscribe(undefined, {
      onData(data) {
        // ^ note that `data` here is inferred
        console.log('received', data);
        count++;
        if (count > 6) {
          // stop after 3 pulls
          subscription.unsubscribe();
          resolve();
        }
      },
      onError(err) {
        console.error('error', err);
      },
    });
  });
  wsClient.close();
}

main();
