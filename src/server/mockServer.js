const path = require('path');
const express = require('express');
const mockServer = express();

const port = 9990;

// TODO: move these functions to a middleware file?
// TODO: create a function and endpoint to delete a mock route

// this function gets called when the /mock endpoint is hit and is what sends the mock response
const createMockRoute = (method, endpoint, response) => {
  mockServer[method.toLowerCase()](endpoint, (req, res) => {
    res.send(response);
  });
};

// returns all existing routes as an array of strings
const getAllExistingRoutes = () => {
  const routes = mockServer._router.stack
    .filter((layer) => layer.route)
    .map(
      (layer) => `${Object.keys(layer.route.methods)} - ${layer.route.path}`
    );

  return routes;
};

mockServer.use(express.static(path.resolve(__dirname, '../../build')));
mockServer.use(express.urlencoded({ extended: true }));
mockServer.use(express.json());

mockServer.get('/', (req, res) => res.send('Hello World!'));

// renderer process sends a POST request to /mock with the user's mock data
mockServer.post('/mock', (req, res) => {
  const { method, endpoint, response } = req.body;

  createMockRoute(method, endpoint, response);

  // sends a confirmation back that the route has been created
  res.send(`Mock route to ${endpoint} has been created.`);
});

// gets all the routes that have been created
mockServer.get('/list-routes', (req, res) => {
  // gets all routes and joins them into a newline separated string
  const routes = getAllExistingRoutes().join('\n');

  res.send(routes);
});

module.exports = mockServer.listen(port, () =>
  console.log(`Listening on port ${port}`)
);
