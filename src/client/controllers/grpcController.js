const { api } = window;

const grpcController = {};

grpcController.openGrpcConnection = (reqResObj, connectionArray) => {
  //check for connection, if not open one

  reqResObj.connectionType = "GRPC";
  reqResObj.response.times = [];

  // build out variables from reqresObj properties
  const { service, rpc, packageName, url, queryArr } = reqResObj;
  const services = reqResObj.servicesObj;
  if (reqResObj.response.events === null) {
    reqResObj.response.events = [];
  }
  if (reqResObj.response.headers === null) {
    reqResObj.response.headers = {};
  }

  // go through services object, find service where name matches our passed
  // in service, then grab the rpc list of that service, also save that service
  // let rpcList;
  let foundService;
  let rpcType;
  let foundRpc;

  for (let i = 0; i < services.length; i++) {
    if (services[i].name === service) {
      foundService = services[i];
      // now loop through the rpcList and get our rpc along with rpc type
      for (let j = 0; j < foundService.rpcs.length; j++) {
        if (foundService.rpcs[j].name === rpc) {
          foundRpc = foundService.rpcs[j];
          rpcType = foundRpc.type;
        }
      }
    }
  }

  // send info to main to get client and meta
  api.send("fetch-meta-and-client", {
    reqResObj,
    rpcType,
  });
};
export default grpcController;
