const path = require('path');
const express = require('express');
const mockServer = express();

const PORT = 9990;
const ROOT = '/';
const MOCK = '/mock';
const LISTROUTES = '/list-routes';

// TODO: move these functions to a middleware file?
// TODO: create a function and endpoint to delete a mock route

// this function gets called when the /mock endpoint is hit and is what sends the mock response
const createMockRoute = (method, endpoint, response) => {
  mockServer[method.toLowerCase()](endpoint, (req, res) => {
    res.send(response);
  });
};

// returns an object where the keys are the method types and the values are an array of endpoints
const getAllExistingRoutes = () => {
  const routesObj = mockServer._router.stack.reduce((outputObj, layer) => {
    const { route } = layer;

    if (route && ![ROOT, MOCK, LISTROUTES].includes(route.path)) {
      const { methods, path } = route;
      const method = Object.keys(methods);

      outputObj.hasOwnProperty(method)
        ? outputObj[method].push(path)
        : outputObj[method] = [path];
    }

    return outputObj;
  }, {});

  return routesObj;
};

mockServer.use(express.static(path.resolve(__dirname, '../../build')));
mockServer.use(express.urlencoded({ extended: true }));
mockServer.use(express.json());

mockServer.get(ROOT, (req, res) => res.send('Hello World!'));

// renderer process sends a POST request to /mock with the user's mock data
mockServer.post(MOCK, (req, res) => {
  const { method, endpoint, response } = req.body;

  createMockRoute(method, endpoint, response);

  // sends a confirmation back that the route has been created
  res.send(`Mock route to ${endpoint} has been created.`);
});

// gets all the routes that have been created
mockServer.get(LISTROUTES, (req, res) => {
  res.send(getAllExistingRoutes());
});

module.exports = mockServer.listen(PORT, () =>
  console.log(`Listening on port ${PORT}`)
);