import React, { useState } from 'react';
const { api } = window;

// import tRPC client Module
import {
  createTRPCProxyClient,
  httpBatchLink,
  createWSClient,
  wsLink,
  splitLink,
} from '@trpc/client';
import SendRequestButton from '../sharedComponents/requestButtons/SendRequestButton';
import TextCodeArea from '../sharedComponents/TextCodeArea';

type Props = {
  onClose: () => void;
} & Record<string, any>;

export default function TRPCSubscriptionContainer(props: Props) {
  const [endPoint, setEndpoint] = useState('');
  const [link, setLink] = useState('');
  const [responseBody, setResponseBody] = useState('');
  const [subscriptionStarted, setsubscriptionStarted] = useState(false);
  const endpointHandler = (e) => {
    setEndpoint(e.target.value);
  };
  const urlChangeHandler = (e) => {
    setLink(e.target.value);
  };
  let sub;
  const startSubscription = async () => {
    setsubscriptionStarted(true);
    try {
      const wsClient = createWSClient({
        url: link,
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
      const endpoint = endPoint;

      sub = client[endPoint].subscribe(undefined, {
        onData: (message) => {
          setResponseBody((pre) => {
            if (pre === 'subscription started') {
              return `${new Date()}\n${message}`;
            } else {
              return `${pre}\n\n${new Date()}\n${message}`;
            }
          });
        },
      });

      setResponseBody(`Subscription at ${endpoint} started`);
    } catch (e) {
      setResponseBody(JSON.stringify(e));
    }
  };
  const endSubscription = () => {
    sub?.unsubscribe();
    setsubscriptionStarted(false);
  };

  return (
    <div>
      <h3 style={h3Styles}>Your subscription</h3>
      <div
        className="is-flex is-justify-content-center"
        style={{ padding: '10px' }}
      >
        <div id="tRPCButton" className="no-border-please button is-webrtc">
          <span>Subscription</span>
        </div>
        <input
          className="ml-1 input input-is-medium is-info"
          type="text"
          placeholder="Enter your WS url"
          value={link}
          onChange={(e) => {
            urlChangeHandler(e);
          }}
        />
        <div className="is-flex is-justify-content-center is-align-items-center ml-4">
          <div className="delete m-auto" onClick={props.onClose} />
        </div>
      </div>
      <input
        className="ml-1 input input-is-medium is-info"
        type="text"
        placeholder="Endpoint"
        value={endPoint}
        onChange={(e) => {
          endpointHandler(e);
        }}
      />
      {subscriptionStarted && (
        <div>
          Log will appear down here
          <TextCodeArea
            value={responseBody}
            mode="application/json"
            readOnly={true}
          />
        </div>
      )}

      {!subscriptionStarted ? (
        <SendRequestButton
          onClick={startSubscription}
          buttonText="Start Subscription"
        />
      ) : (
        <SendRequestButton
          onClick={endSubscription}
          buttonText="Stop Subscription"
        />
      )}
    </div>
  );
}

const h3Styles = {
  display: 'block',
  fontSize: '1.17em',
  fontWeight: 'bold',
};

