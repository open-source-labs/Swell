import store from "../../toolkit-refactor/store";
import { appDispatch } from "../../toolkit-refactor/store";
import { responseDataSaved, reqResUpdated } from "../../toolkit-refactor/reqRes/reqResSlice";
import { ReqRes, WindowExt } from "../../../types";
import { LoadTestResult } from "./LoadTest";
import { graphUpdated } from "../../toolkit-refactor/graphPoints/graphPointsSlice";

const { api } = window as unknown as WindowExt;

const LoadTestController = () => {

  const processLoadTestResults = (loadTestResults: LoadTestResult, reqResObj: ReqRes) => {
    api.receive('load-test-results', (reqResObj: ReqRes) => {
      if (reqResObj.response.events) {
        appDispatch(graphUpdated(reqResObj));
        appDispatch(reqResUpdated(reqResObj));
      }
    })

    api.send('http-load-test')
  };

  return {
    processLoadTestResults,
  };
};

export default LoadTestController;
