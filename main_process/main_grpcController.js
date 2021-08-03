const { ipcMain } = require('electron');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
// ======================= grpcController.openGrpcConnection

const testingController = require('./main_testingController');

const grpcController = {};

grpcController.openGrpcConnection = (event, reqResObj) => {
  const { service, rpc, packageName, url, queryArr } = reqResObj;

  reqResObj.connectionType = 'GRPC';
  reqResObj.response.times = [];
  reqResObj.response.headers = {};
  reqResObj.response.events = [];

  // go through services object, find service where name matches our passed
  // in service, then grab the rpc list of that service, also save that service
  // let rpcList;
  const services = reqResObj.servicesObj;
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

  const PROTO_PATH = reqResObj.protoPath;
  const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });
  // create client credentials
  const serverName = grpc.loadPackageDefinition(packageDefinition)[packageName];
  const client = new serverName[service](
    url,
    grpc.credentials.createInsecure()
  );

  // create client requested metadata key and value pair for each type of streaming
  const meta = new grpc.Metadata();
  // this is doing nothing right now
  const metaArr = reqResObj.request.headers;
  for (let i = 0; i < metaArr.length; i += 1) {
    const currentHeader = metaArr[i];
    meta.add(currentHeader.key, currentHeader.value);
  }

  if (rpcType === 'UNARY') {
    const query = reqResObj.queryArr[0];
    const time = {};

    // Open Connection and set time sent for Unary
    reqResObj.connection = 'open';

    time.timeSent = Date.now();
    // make Unary call
    client[rpc](query, meta, (err, data) => {
      if (err) {
        console.log('unary error', err);
        reqResObj.connection = 'error';
        event.sender.send('reqResUpdate', reqResObj);
        return;
      }
      // Close Connection and set time received for Unary
      reqResObj.timeSent = time.timeSent;

      time.timeReceived = Date.now();
      reqResObj.timeReceived = time.timeReceived;

      reqResObj.connection = 'closed';
      reqResObj.response.events.push(data);
      reqResObj.response.times.push(time);
      // check to see if there is a test script to run
      if (reqResObj.request.testContent) {
        reqResObj.response.testResult = testingController.runTest(
          reqResObj.request.testContent,
          reqResObj,
          data
        );
      }
      // send stuff back for store
      event.sender.send('reqResUpdate', reqResObj);
    }) // metadata from server
      .on('metadata', (data) => {
        // metadata is a Map, not an object
        const metadata = data.internalRepr;
        // set metadata Map as headers
        metadata.forEach((value, key) => {
          reqResObj.response.headers[key] = value[0];
        });
        event.sender.send('reqResUpdate', reqResObj);
      });
  } else if (rpcType === 'SERVER STREAM') {
    const timesArr = [];
    // Open Connection for SERVER Stream
    reqResObj.connection = 'open';
    reqResObj.timeSent = Date.now();
    const call = client[rpc](reqResObj.queryArr[0], meta);
    call.on('data', (resp) => {
      const time = {};
      time.timeReceived = Date.now();
      time.timeSent = reqResObj.timeSent;
      reqResObj.response.times.push(time);
      reqResObj.timeReceived = time.timeReceived; //  overwritten on each call to get the final value
      reqResObj.response.events.push(resp);
      // check to see if there is a test script to run
      if (reqResObj.request.testContent) {
        reqResObj.response.testResult = testingController.runTest(
          reqResObj.request.testContent,
          reqResObj,
          resp
        );
      }
      event.sender.send('reqResUpdate', reqResObj);
    });
    call.on('error', () => {
      // for fatal error from server
      console.log('server side stream error');
      reqResObj.connection = 'error';
      event.sender.send('reqResUpdate', reqResObj);
    });
    call.on('end', () => {
      // Close Connection for SERVER Stream
      if (reqResObj.connection !== 'error') reqResObj.connection = 'closed';
      // no need to push response to reqResObj, no event expected from on 'end'
      event.sender.send('reqResUpdate', reqResObj);
    });
    call.on('metadata', (data) => {
      const metadata = data.internalRepr;
      // set metadata Map as headers
      metadata.forEach((value, key) => {
        reqResObj.response.headers[key] = value[0];
      });
      event.sender.send('reqResUpdate', reqResObj);
    });
  } else if (rpcType === 'CLIENT STREAM') {
    // create call and open client stream connection
    reqResObj.connection = 'open';
    const timeSent = Date.now();
    reqResObj.timeSent = timeSent;
    const call = client[rpc](meta, (error, response) => {
      if (error) {
        console.log('error in client stream', error);
        reqResObj.connection = 'error';
        event.sender.send('reqResUpdate', reqResObj);
        return;
      }
      // Close Connection for client Stream
      reqResObj.connection = 'closed';
      const curTime = Date.now();
      reqResObj.response.times.forEach((time) => {
        time.timeReceived = curTime;
        reqResObj.timeReceived = time.timeReceived;
      });
      reqResObj.response.events.push(response);
      // check to see if there is a test script to run
      if (reqResObj.request.testContent) {
        reqResObj.response.testResult = testingController.runTest(
          reqResObj.request.testContent,
          reqResObj,
          response
        );
      }
      // update state
      event.sender.send('reqResUpdate', reqResObj);
    }).on('metadata', (data) => {
      // metadata is a Map, not an object
      const metadata = data.internalRepr;

      metadata.forEach((value, key) => {
        reqResObj.response.headers[key] = value[0];
      });
      event.sender.send('reqResUpdate', reqResObj);
    });

    for (let i = 0; i < queryArr.length; i++) {
      const query = queryArr[i];
      // Open Connection for client Stream
      // this needs additional work to provide correct sent time for each
      // request without overwrite
      const time = {};

      reqResObj.connection = 'pending';

      time.timeSent = timeSent;
      reqResObj.response.times.push(time);
      call.write(query);
    }
    call.end();
  }

  // else BIDIRECTIONAL
  else {
    let counter = 0;
    const call = client[rpc](meta);
    call.on('data', (response) => {
      const curTimeObj = reqResObj.response.times[counter];
      counter++;
      // Close Individual Server Response for BIDIRECTIONAL Stream
      reqResObj.connection = 'pending';
      curTimeObj.timeReceived = Date.now();
      reqResObj.timeReceived = curTimeObj.timeReceived;
      reqResObj.response.events.push(response);
      reqResObj.response.times.push(curTimeObj);
      // check to see if there is a test script to run
      if (reqResObj.request.testContent) {
        reqResObj.response.testResult = testingController.runTest(
          reqResObj.request.testContent,
          reqResObj,
          response
        );
      }
      // update redux store
      event.sender.send('reqResUpdate', reqResObj);
    }); // metadata from server
    call.on('metadata', (data) => {
      const metadata = data.internalRepr;

      metadata.forEach((value, key) => {
        reqResObj.response.headers[key] = value[0];
      });
      event.sender.send('reqResUpdate', reqResObj);
    });
    call.on('error', () => {
      console.log('server ended connection with error');
      reqResObj.connection = 'error';
      event.sender.send('reqResUpdate', reqResObj);
    });
    call.on('end', (data) => {
      // Close Final Server Connection for BIDIRECTIONAL Stream
      if (reqResObj.connection !== 'error') reqResObj.connection = 'closed';
      // no need to push response to reqResObj, no event expected from on 'end'
      event.sender.send('reqResUpdate', reqResObj);
    });

    for (let i = 0; i < queryArr.length; i++) {
      const time = {};
      const query = queryArr[i];
      // Open Connection for BIDIRECTIONAL Stream
      if (i === 0) {
        reqResObj.connection = 'open';
      } else {
        reqResObj.connection = 'pending';
      }
      time.timeSent = Date.now();
      reqResObj.timeSent = time.timeSent;
      reqResObj.response.times.push(time);
      call.write(query);
    }
    call.end();
  }
  event.sender.send('reqResUpdate', reqResObj);
};

module.exports = () => {
  // creating our event listeners for IPC events
  ipcMain.on('open-grpc', (event, reqResObj) => {
    // we pass the event object into these controller functions so that we can invoke event.sender.send when we need to make response to renderer process
    grpcController.openGrpcConnection(event, reqResObj);
  });
};
