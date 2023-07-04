import Store from '../toolkit-refactor/store';
import { appDispatch } from '../toolkit-refactor/store';

import {
  responseDataSaved,
  reqResUpdated,
  reqResReplaced,
  reqResCleared,
} from '../toolkit-refactor/slices/reqResSlice';
import {
  groupCleared,
  graphCleared,
  graphUpdated,
} from '../toolkit-refactor/slices/graphPointsSlice';

import graphQLController from './graphQLController';
import { ReqRes, WindowExt } from '../../types';

const { api } = window as unknown as WindowExt;

// This handles all connections
const connectionController = {
  openConnectionArray: [] as number[] | number[],

  // toggles checked in state for entire reqResArray
  toggleSelectAll(): void {
    const { reqResArray } = Store.getState().reqRes;

    if (reqResArray.every((obj) => obj.checked === true)) {
      reqResArray.forEach((obj) => (obj.checked = false));
    } else {
      reqResArray.forEach((obj) => (obj.checked = true));
    }
    appDispatch(reqResReplaced(reqResArray));
  },

  // listens for reqResUpdate event from main process telling it to update reqResObj REST EVENTS
  openReqRes(id: number | string): void {
    // remove all previous listeners for 'reqResUpdate' before starting to listen for 'reqResUpdate' again
    api.removeAllListeners('reqResUpdate');

    api.receive('reqResUpdate', (reqResObj: ReqRes) => {
      if (
        (reqResObj.connection === 'closed' ||
          reqResObj.connection === 'error') &&
        reqResObj.timeSent &&
        reqResObj.timeReceived &&
        reqResObj.response.events &&
        reqResObj.response.events.length > 0
      ) {
        appDispatch(graphUpdated(reqResObj));
      }
      appDispatch(reqResUpdated(reqResObj));
      // If current selected response equals reqResObj received, update current response

      /** @todo Find where id should be */
      const currentID = Store.getState().reqRes.currentResponse.id;
      if (currentID === reqResObj.id) {
        appDispatch(responseDataSaved(reqResObj));
      }
    });
    // Since only obj ID is passed in, next two lines get the current array of request objects and finds the one with matching ID
    const reqResArr: ReqRes[] = Store.getState().reqRes.reqResArray;
    const reqResObj = reqResArr.find((el) => el.id === id);
    if (!reqResObj) {
      return;
    }

    if (reqResObj.trpc) {
      api.send('open-trpc', reqResObj);
    } else if (reqResObj.request.method === 'SUBSCRIPTION')
      graphQLController.openSubscription(reqResObj);
    else if (reqResObj.graphQL) {
      graphQLController.openGraphQLConnection(reqResObj);
    } else if (/wss?:\/\//.test(reqResObj.protocol) && !reqResObj.webrtc) {
      // create context bridge to wsController in node process to open connection, send the reqResObj and connection array
      api.send('open-ws', reqResObj, this.openConnectionArray);
    }
    // gRPC connection
    else if (reqResObj.gRPC) {
      api.send('open-grpc', reqResObj);
      // Standard HTTP?
      // TODO (look for TODO tree)
    } else if (reqResObj.openapi) {
      console.log('got an open api request to fill');
      //console.log(reqResObj);
    } else {
      api.send('open-http', reqResObj, this.openConnectionArray);
    }
  },

  runCollectionTest(reqResArray: ReqRes[]): void {
    api.removeAllListeners('reqResUpdate');
    let index = 0;
    api.receive('reqResUpdate', (reqResObj: ReqRes) => {
      if (
        (reqResObj.connection === 'closed' ||
          reqResObj.connection === 'error') &&
        reqResObj.timeSent &&
        reqResObj.timeReceived &&
        reqResObj.response.events.length > 0
      ) {
        appDispatch(graphUpdated(reqResObj));
      }
      appDispatch(reqResUpdated(reqResObj));

      appDispatch(responseDataSaved(reqResObj));
      if (index < reqResArray.length) {
        runSingletest(reqResArray[index]);
        index += 1;
      }
    });
    const reqResObj = reqResArray[index];

    function runSingletest(reqResObj: ReqRes) {
      if (reqResObj.request.method === 'SUBSCRIPTION')
        graphQLController.openSubscription(reqResObj);
      else if (reqResObj.graphQL) {
        graphQLController.openGraphQLConnectionAndRunCollection(reqResArray);
      } else if (/wss?:\/\//.test(reqResObj.protocol)) {
        // create context bridge to wsController in node process to open connection, send the reqResObj and connection array
        api.send('open-ws', reqResObj);
        // update the connectionArray when connection is open from ws
        api.receive('update-connectionArray', (connectionArray: number[]) => {
          // is this the correct type???
          connectionController.openConnectionArray.push(...connectionArray);
        });
      }
      // gRPC connection
      else if (reqResObj.gRPC) {
        api.send('open-grpc', reqResObj);
        // Standard HTTP?
      } else {
        api.send('open-http', reqResObj);
      }
    }
    runSingletest(reqResObj);
    index += 1;
  },

  openAllSelectedReqRes(): void {
    connectionController.closeAllReqRes();

    const { reqResArray } = Store.getState().reqRes;
    reqResArray.forEach((reqRes) => connectionController.openReqRes(reqRes.id));
  },

  // We are pretty sure that this is not used anymore... -Prince
  // getConnectionObject(id: number): any {
  //   // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'never'.
  //   console.log('getConnectionObject has been invoked');
  //   return this.openConnectionArray.find((obj) => (obj.id = id));
  // },

  setReqResConnectionToClosed(id: string): void {
    const reqResArr = Store.getState().reqRes.reqResArray;

    const foundReqRes: ReqRes = JSON.parse(
      JSON.stringify(reqResArr.find((reqRes: ReqRes) => reqRes.id === id))
    );

    foundReqRes.connection = 'closed';
    appDispatch(reqResUpdated(foundReqRes));
    appDispatch(responseDataSaved(foundReqRes));
  },

  closeReqRes(reqResObj: ReqRes): void {
    if (reqResObj.graphQL && reqResObj.request?.method === 'SUBSCRIPTION') {
      graphQLController.closeSubscription(reqResObj);
    } else if (reqResObj.protocol.includes('http')) {
      api.send('close-http', reqResObj);
    } else if (/wss?:\/\//.test(reqResObj.protocol)) {
      api.send('close-ws');
    }

    const { id } = reqResObj;
    this.setReqResConnectionToClosed(id);
  },

  /* Closes all open endpoint */
  closeAllReqRes(): void {
    const { reqResArray } = Store.getState().reqRes;
    reqResArray.forEach((reqRes: ReqRes) =>
      connectionController.closeReqRes(reqRes)
    );
  },

  clearAllReqRes(): void {
    connectionController.closeAllReqRes();
    appDispatch(reqResCleared());
  },

  // toggles minimized in ReqRes array in state
  toggleMinimizeAll(): void {
    const { reqResArray }: { reqResArray: ReqRes[] } = Store.getState().reqRes;

    if (reqResArray.every((obj: ReqRes) => obj.minimized === true)) {
      reqResArray.forEach((obj: ReqRes) => (obj.minimized = false));
    } else {
      reqResArray.forEach((obj: ReqRes) => (obj.minimized = true));
    }
    appDispatch(reqResReplaced(reqResArray));
  },
  // clears a dataPoint from state
  clearGraph(): void {
    appDispatch(groupCleared());
  },
  // clears ALL data points from state
  clearAllGraph(): void {
    appDispatch(graphCleared());
  },
};

export default connectionController;
