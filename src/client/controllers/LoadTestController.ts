/**
 * LoadTestController is a module responsible for processing the results of load tests.
 * This module contains functions that handle the conversion of load test results to events array,
 * as well as updating the application state (store) with the processed results.
 */

import store, { appDispatch } from '~/toolkit/store';
import { responseDataSaved, reqResUpdated } from '~/toolkit/slices/reqResSlice';
import { graphUpdated } from '~/toolkit/slices/graphPointsSlice';

import { type ReqRes, type ReqResResponse, type WindowExt } from '~/types';
import { LoadTestResult } from '../components/main/sharedComponents/stressTest/LoadTest';

const { api } = window as unknown as WindowExt;

const LoadTestController = {
  /**
   * Processes the results of a load test and updates the application state.
   *
   * This function finds the matching request-response object in the store using the provided ID,
   * updates the object with the processed load test results, and dispatches the necessary actions
   * to update the store and associated UI components.
   *
   * @param {string | number} id - The ID of the request-response object to be updated.
   * @param {LoadTestResult} results - The LoadTestResult object containing the load test results.
   */
  processLoadTestResults(id: string | number, results: LoadTestResult): void {
    const reqResArray: ReqRes[] = store.getState().reqRes.reqResArray;

    const reqResObj: ReqRes | undefined = reqResArray.find(
      (el: ReqRes) => el.id === id
    );
    if (!reqResObj) return;
    const newReqRes: ReqRes = {
      ...reqResObj,
      response: {
        ...reqResObj.response,
        events: results,
      },
    };

    if (
      reqResObj &&
      (reqResObj.connection === 'closed' || reqResObj.connection === 'error') &&
      reqResObj.timeSent &&
      reqResObj.timeReceived &&
      (<ReqResResponse>reqResObj.response).events.length > 0
    ) {
      appDispatch(graphUpdated(newReqRes));
      appDispatch(reqResUpdated(newReqRes));
      appDispatch(responseDataSaved(newReqRes));
    }

    appDispatch(reqResUpdated(newReqRes));
    appDispatch(responseDataSaved(newReqRes));
  },
};

export default LoadTestController;

