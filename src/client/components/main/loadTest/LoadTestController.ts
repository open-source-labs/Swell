import store from "../../../toolkit-refactor/store";
import { appDispatch } from "../../../toolkit-refactor/store";
import { responseDataSaved, reqResUpdated } from "../../../toolkit-refactor/reqRes/reqResSlice";
import { ReqRes, WindowExt } from "../../../../types";
import { LoadTestResult } from "./LoadTest";
import { graphUpdated } from "../../../toolkit-refactor/graphPoints/graphPointsSlice";

const { api } = window as unknown as WindowExt;

const LoadTestController = {

  convertLoadTestResultToEventsArray(loadTestResult: LoadTestResult): Record<string, unknown>[] {
    return [
      { totalSent: loadTestResult.totalSent },
      { totalReceived: loadTestResult.totalReceived },
      { totalMissed: loadTestResult.totalMissed },
      { averageResponseTime: loadTestResult.averageResponseTime },
      { totalNotSent: loadTestResult.totalNotSent },
      { errorCounts: loadTestResult.errorCounts },
    ];
  },
  
  processLoadTestResults(id: string | number, results: LoadTestResult): void {
    // Get the current array of request objects
    const reqResArray: ReqRes[] = store.getState().reqRes.reqResArray;

    // Find the reqResObj with a matching ID
    const reqResObj: ReqRes = reqResArray.find(
      (el: ReqRes) => el.id === id
    );
    const newReqRes: ReqRes = {
      ...reqResObj,
      response: {
        ...reqResObj.response,
        events: this.convertLoadTestResultToEventsArray(results),
      }
    }
    // Check if the reqResObj is valid and has the necessary conditions
    if (
      reqResObj &&
      (reqResObj.connection === "closed" || reqResObj.connection === "error") &&
      reqResObj.timeSent &&
      reqResObj.timeReceived &&
      reqResObj.response.events.length > 0
    ) {
      // Dispatch graphUpdated and reqResUpdated actions
      appDispatch(graphUpdated(newReqRes));
      appDispatch(reqResUpdated(newReqRes));
      appDispatch(responseDataSaved(newReqRes));
    }
    // Dispatch graphUpdated and reqResUpdated actions
    // appDispatch(graphUpdated(reqResObj));
    appDispatch(reqResUpdated(newReqRes));
    appDispatch(responseDataSaved(newReqRes));
  },
};

export default LoadTestController;
