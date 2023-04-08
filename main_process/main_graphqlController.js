const { ApolloClient, InMemoryCache, createHttpLink, ApolloLink } = require('@apollo/client');
const gql = require('graphql-tag');
const { getIntrospectionQuery } = require('graphql');
const { onError } = require("@apollo/client/link/error");
const fetch = require('cross-fetch');
const cookie = require('cookie');
const { ipcMain } = require('electron');

const testingController = require('./main_testingController');

const graphqlController = {
  /* NEED TO INCORPORATE COOKIES AND HEADERS IN QUERIES AND MUTATIONS */
  openConnection(event, args) {
    const { reqResObj } = args;

    // populating headers object with response headers - except for Content-Type
    const headers = {};
    reqResObj.request.headers
      .filter((item) => item.key !== 'Content-Type')
      .forEach((item) => {
        headers[item.key] = item.value;
      });

    // request cookies from reqResObj to request headers
    let cookies = '';
    if (reqResObj.request.cookies.length) {
      cookies = reqResObj.request.cookies.reduce(
        (acc, userCookie) => `${acc}${userCookie.key}=${userCookie.value}; `,
        ''
      );
    }
    headers.Cookie = cookies;

    // afterware takes headers from context response object, copies to reqResObj
    const afterLink = new ApolloLink((operation, forward) =>
      forward(operation).map((response) => {
        const context = operation.getContext();
        const headers = context.response.headers.entries();
        for (const headerItem of headers) {
          const key = headerItem[0]
            .split('-')
            .map((item) => item[0].toUpperCase() + item.slice(1))
            .join('-');
          reqResObj.response.headers[key] = headerItem[1];

          // if cookies were sent by server, parse first key-value pair, then cookie.parse the rest
          if (headerItem[0] === 'set-cookie') {
            const parsedCookies = [];
            const cookieStrArr = headerItem[1].split(', ');
            cookieStrArr.forEach((thisCookie) => {
              thisCookie = thisCookie.toLowerCase();
              // index of first semicolon
              const idx = thisCookie.search(/[;]/g);
              // first key value pair
              const keyValueArr = thisCookie.slice(0, idx).split('=');
              // cookie contents after first key value pair
              const parsedRemainingCookieProperties = cookie.parse(
                thisCookie.slice(idx + 1)
              );

              const parsedCookie = {
                ...parsedRemainingCookieProperties,
                name: keyValueArr[0],
                value: keyValueArr[1],
              };

              parsedCookies.push(parsedCookie);
            });
            reqResObj.response.cookies = parsedCookies;
          }
        }

        return response;
      })
    );

    // creates http connection to host
    const httpLink = createHttpLink({
      uri: reqResObj.url,
      headers,
      credentials: 'include',
      fetch: fetch,
    });

    const errorLink = onError(({ graphQLErrors, networkError }) => {
      if (networkError) {
        reqResObj.error = JSON.stringify(networkError);
        event.sender.send('reply-gql', { error: networkError, reqResObj });
      }
      try {
        // check if there are any errors in the graphQLErrors array
        if (graphQLErrors) {
          graphQLErrors.forEach((currError) => {
            reqResObj.error = JSON.stringify(currError);
            event.sender.send('reply-gql', { error: currError, reqResObj });
          });
        }
      } catch (err) {
        console.log('Error in errorLink:', err);
      }
    });

    // additive composition of multiple links
    // https://www.apollographql.com/docs/react/api/link/introduction/#composing-a-link-chain
    const link = ApolloLink.from([afterLink, errorLink, httpLink]);

    const client = new ApolloClient({
      link,
      cache: new InMemoryCache(),
    });

    try {
      const body = gql`
        ${reqResObj.request.body}
      `;
      // graphql variables: https://graphql.org/learn/queries/#variables
      const variables = reqResObj.request.bodyVariables
        ? JSON.parse(reqResObj.request.bodyVariables)
        : {};

      if (reqResObj.request.method === 'QUERY') {
        client
          .query({ query: body, variables, context: headers })
          .then((data) => {
            // handle tests
            if (reqResObj.request.testContent) {
              reqResObj.response.testResult = testingController.runTest(
                reqResObj.request.testContent,
                reqResObj,
                data,
                true
              );
            }
            event.sender.send('reply-gql', { reqResObj, data });
          })
          .catch((err) => {
            // error is actually sent to graphQLController via "errorLink"
            console.log('gql query error in main_graphqlController.js', err);
          });
      } else if (reqResObj.request.method === 'MUTATION') {
        client
          .mutate({ mutation: body, variables, context: headers })
          .then((data) => {
            reqResObj.response.testResult = testingController.runTest(
              reqResObj.request.testContent,
              reqResObj,
              data
            );
            event.sender.send('reply-gql', { reqResObj, data });
          })
          .catch((err) => {
            // error is actually sent to graphQLController via "errorLink"
            console.error(
              'gql mutation error in main_graphqlController.js',
              err
            );
          });
      }
    } catch (err) {
      console.log(
        'error trying gql query/mutation in main_graphqlController.js',
        err
      );
    }
  },

  /* NEED TO INCORPORATE COOKIES AND HEADERS IN INTROSPECTION */
  introspect(event, introspectionObject) {
    const req = JSON.parse(introspectionObject);

    // Reformat headers
    const headers = {};
    req.headers.forEach(({ active, key, value }) => {
      if (active) headers[key] = value;
    });
    // Reformat cookies
    let cookies = '';
    if (req.cookies.length) {
      cookies = req.cookies.reduce((acc, userCookie) => {
        if (userCookie.active)
          return `${acc}${userCookie.key}=${userCookie.value}; `;
        return acc;
      }, '');
    }
    headers.Cookie = cookies;

    fetch(req.url, {
      method: 'post',
      headers: headers,
      body: JSON.stringify({ query: getIntrospectionQuery() }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        event.sender.send('introspect-reply', data.data)
      })
      .catch((err) => 
        event.sender.send(
          'introspect-reply',
          `Error: ${err}`,
        )
      );
  },
};

module.exports = () => {
  ipcMain.on('open-gql', (event, args) => {
    graphqlController.openConnection(event, args);
  });

  ipcMain.on('introspect', (event, introspectionObject) => {
    graphqlController.introspect(event, introspectionObject);
  });
};
