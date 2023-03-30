/**
 * LoadTestController is a module responsible for processing the results of load tests.
 * This module contains functions that handle the conversion of load test results to events array,
 * as well as updating the application state (store) with the processed results.
 */

import store from '../toolkit-refactor/store';
import { appDispatch } from '../toolkit-refactor/store';
import {
  responseDataSaved,
  reqResUpdated,
} from '../toolkit-refactor/reqRes/reqResSlice';
import { ReqRes, WindowExt } from '../../types';
import { LoadTestResult } from '../components/main/loadTest/LoadTest';
import { graphUpdated } from '../toolkit-refactor/graphPoints/graphPointsSlice';

const { api } = window as unknown as WindowExt;

const LoadTestController = {
  /**
   * Converts a LoadTestResult object into an array of events.
   *
   * @param {LoadTestResult} loadTestResult - The LoadTestResult object containing the load test results.
   * @returns {Record<string, unknown>[]} An array of events, each represented as an object.
   */
  convertLoadTestResultToEventsArray(
    loadTestResult: LoadTestResult
  ): Record<string, unknown>[] {
    return [
      { totalSent: loadTestResult.totalSent },
      { totalReceived: loadTestResult.totalReceived },
      { totalMissed: loadTestResult.totalMissed },
      { averageResponseTime: loadTestResult.averageResponseTime },
      { totalNotSent: loadTestResult.totalNotSent },
      { errorCounts: loadTestResult.errorCounts },
    ];
  },

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

    const reqResObj: ReqRes = reqResArray.find((el: ReqRes) => el.id === id);
    const newReqRes: ReqRes = {
      ...reqResObj,
      response: {
        ...reqResObj.response,
        events: this.convertLoadTestResultToEventsArray(results),
      },
    };

    if (
      reqResObj &&
      (reqResObj.connection === 'closed' || reqResObj.connection === 'error') &&
      reqResObj.timeSent &&
      reqResObj.timeReceived &&
      reqResObj.response.events.length > 0
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

