const http = require('http');
// native browser api that we are bringing in to work in a node environmnet
const EventSource = require('eventsource');

const SSEController = {};

// keep reference to what will be our EventSource that listens for SSE's
SSEController.sseOpenConnections = {};

SSEController.returnErrorToFrontEnd = (reqResObj, event, error) => {
  reqResObj.connection = 'error';
  reqResObj.error = error;
  reqResObj.response.events.push(error.message);
  event.sender.send('reqResUpdate', reqResObj);
};

SSEController.createStream = (reqResObj, options, event) => {
  // got options from httpController
  const { headers } = options;

  /* because EventSource cannot access headers, we are making a regular get request to SSE server to get its headers, 
    and then passing those headers into function where we will be connecting our EventSource, there will a time delay 
    between the time the user opens the request and the server sends back its first response. We keep reference to the time 
    the first request was made to account for that time difference later on. */
  const startTime = Date.now();

  try {
    http
      .get(headers.url, (res) => {
        reqResObj.response.headers = { ...res.headers };
        reqResObj.connection = 'open';
        reqResObj.connectionType = 'SSE';
        // this is for purpose of logic in graph.jsx, which needs the entire req/res obj to have a timeReceived
        reqResObj.timeReceived = Date.now();
        // invoke function that will create an EventSource
        SSEController.readStream(reqResObj, event, Date.now() - startTime);
        res.destroy();
      })
      .on('error', (e) => {
        console.error(`Got error: ${e.message}`);
      });
  } catch (error) {
    console.log(
      'error making initial get reuest in SSE controller\n',
      error.message
    );
    SSEController.returnErrorToFrontEnd(reqResObj, event, error);
  }
};

SSEController.readStream = (reqResObj, event, timeDiff) => {
  // EventSource listens for SSE's and process specially formatted data from them, as well as adding other useful information
  const sse = new EventSource(reqResObj.url);
  SSEController.sseOpenConnections[reqResObj.id] = sse;

  sse.onopen = () => {
    // console.log(`SSE at ${reqResObj.url} opened!`);
  };

  sse.onmessage = (message) => {
    // message is not a javascript object, so we spread its contents into one
    const newMessage = { ...message };
    // this is where where account for any time lost between the first AJAX request and the creation of the EventSource
    newMessage.timeReceived = Date.now() - timeDiff;

    reqResObj.response.events.push(newMessage);
    return event.sender.send('reqResUpdate', reqResObj);
  };
  sse.onerror = (error) => {
    console.log('there was an error in SSEController.readStream', error);
    sse.close();
    SSEController.returnErrorToFrontEnd(reqResObj, event, error);
  };
};

SSEController.closeConnection = (reqResId) => {
  if (!SSEController.sseOpenConnections[reqResId]) {
    return;
  }

  const sse = SSEController.sseOpenConnections[reqResId];
  sse.close();
  delete SSEController.sseOpenConnections[reqResId];
};

module.exports = SSEController;
