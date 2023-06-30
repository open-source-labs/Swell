import React from 'react';
import TRPCPrceduresEndPoint from './TRPCPrceduresEndPoint';
// import tRPC client Module
import {
  createTRPCProxyClient,
  httpBatchLink,
  createWSClient,
  wsLink,
  splitLink,
} from '@trpc/client';
import SendRequestButton from '../sharedComponents/requestButtons/SendRequestButton';

export default function TRPCSubscriptionContainer(props) {
  const proceduresJSX = props.procedures.map((procedure, index) => {
    return (
      <TRPCPrceduresEndPoint
        proceduresDipatch={props.proceduresDipatch}
        index={index}
        key={index}
        procedureData={procedure}
      ></TRPCPrceduresEndPoint>
    );
  });

  let sub;
  const startSubscription = async () => {
    const wsClient = createWSClient({
      url: props.requestFields.url,
    });

    const client = createTRPCProxyClient({
      links: [
        splitLink({
          condition: (op) => {
            return op.type === 'subscription';
          },
          true: wsLink({
            client: wsClient,
          }),
          false: httpBatchLink({
            url: 'http://localhost:3000/trpc',
          }),
        }),
      ],
    });
    const endpoint = props.procedures[0].endpoint;

    sub = client[endpoint].subscribe(undefined, {
      onData: (message) => {
        console.log(message);
      },
    });
  };

  const endSubscription = () => {
    sub.unsubscribe();
  };

  return (
    <div>
      <h3 style={h3Styles}>Your Procedure/s</h3>
      {proceduresJSX}
      <SendRequestButton
        onClick={startSubscription}
        buttonText="Start Subscription"
      />
      <SendRequestButton
        onClick={endSubscription}
        buttonText="Stop Subscription"
      />
    </div>
  );
}

const h3Styles = {
  display: 'block',
  fontSize: '1.17em',
  fontWeight: 'bold',
};
