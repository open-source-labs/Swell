import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ScheduleReqResContainer from '../legacy-components/ScheduleReqResContainer';
import StoppedContainer from '../legacy-components/StoppedContainer';
import ReqResContainer from '../legacy-components/ReqResContainer';
import { simpleLoadTest, LoadTestResult } from '../main/loadTest/LoadTest';
import LoadTestController from '../../controllers/LoadTestController';
import { connect } from 'react-redux';
import {
  reqResUpdated,
  reqResItemAdded,
} from '../../toolkit-refactor/reqRes/reqResSlice';
import { RootState, AppDispatch } from '../../toolkit-refactor/store';
import { ReqRes } from '../../../types';

/**
 * TestContainer component allows users to configure and perform load tests.
 * It contains inputs for the load test frequency and duration, as well as buttons
 * to start and stop the tests. The component also renders the ReqResContainer,
 * ScheduleReqResContainer, and StoppedContainer components to display the results
 * of the tests.
 */

const mapStateToProps = (store: RootState) => ({
  reqResArray: store.reqRes.reqResArray,
  currentResponse: store.reqRes.currentResponse,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  reqResItemAdded: (reqRes: ReqRes) => {
    dispatch(reqResItemAdded(reqRes));
  },
  reqResUpdated: (reqRes: ReqRes) => {
    dispatch(reqResUpdated(reqRes));
  },
});

interface TestContainerProps {
  reqResArray: ReqRes[];
  reqResItemAdded: (reqRes: ReqRes) => void;
  reqResUpdated: (reqRes: ReqRes) => void;
}

const TestContainer: React.FC<TestContainerProps> = ({
  reqResArray,
  currentResponse,
  reqResItemAdded,
  reqResUpdated,
}) => {
  const [isTestRunning, setIsTestRunning] = useState<boolean>(false);
  const [runScheduledTests, setScheduledTests] = useState<boolean>(false);
  const [callsPerSecond, setCallsPerSecond] = useState<number>(1);
  const [totalTime, setTotalTime] = useState<number>(10);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);
  const isDark = useSelector((state: any) => state.ui.isDark);

  const handleShowLoadTest = () => {
    setShowLoadTest(!showLoadTest);
  };

  const [showLoadTest, setShowLoadTest] = useState(false);

  const reqResObj = currentResponse.url
    ? currentResponse
    : reqResArray.length > 0
    ? reqResArray[reqResArray.length - 1]
    : null;

  const getDisabledReason = () => {
    if (isTestRunning) {
      return 'Load test is currently running.';
    } else if (!reqResObj) {
      return 'Please add workspace or send request';
    } else if (!reqResObj.url) {
      return 'URL is missing.';
    } else if (reqResObj.request.method !== 'GET') {
      return 'Only GET requests are supported for load tests.';
    } else {
      return null;
    }
  };

  return (
    <div className="mt-4 mb-4">
      <div
        className={`${
          isDark ? 'is-dark-200' : ''
        } is-rest-invert show-hide-event cards-dropdown minimize-card is-flex is-align-items-center is-justify-content-center`}
        onClick={handleShowLoadTest}
      >
        {showLoadTest === true && (
          <>
            <span>Hide Load Test</span>
          </>
        )}

        {showLoadTest === false && (
          <>
            <span>Load Test</span>
          </>
        )}
      </div>
      {showLoadTest === true && (
        <div id="test-snippets">
          <div>
            <div className="is-flex is-flex-direction-row is-justify-content-center is-align-items-center mt-2">
              <div className="is-flex is-flex-direction-row is-justify-content-center is-align-items-center">
                <p>Frequency:</p>
                <input
                  className={`${
                    isDark ? 'is-dark-200' : ''
                  } ml-1 input input-is-medium is-info`}
                  style={{ width: '65px' }}
                  type="number"
                  placeholder="Calls/sec"
                  value={callsPerSecond}
                  onChange={(e) => {
                    setCallsPerSecond(e.target.value);
                  }}
                />
              </div>
              <div className="is-flex is-flex-direction-row is-justify-content-center is-align-items-center">
                <p>Duration:</p>
                <input
                  className={`${
                    isDark ? 'is-dark-200' : ''
                  } ml-1 input input-is-medium is-info`}
                  style={{ width: '65px' }}
                  type="number"
                  placeholder="Duration"
                  value={totalTime}
                  onChange={(e) => {
                    setTotalTime(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="is-flex is-flex-direction-row is-justify-content-center is-align-items-center mt-2">
              <div className="ml-2">
                <div className="tooltip-wrapper">
                  <button
                    className={`button is-small is-primary ${
                      isDark ? '' : 'is-outlined'
                    } button-padding-vertical button-hover-color ml-3`}
                    onClick={async () => {
                      const controller = new AbortController();
                      setAbortController(controller);
                      setIsTestRunning(true);
                      const results = await simpleLoadTest(
                        reqResObj.url,
                        callsPerSecond,
                        totalTime,
                        controller.signal
                      );
                      console.log(
                        'reqResObj.request.method',
                        reqResObj.request.method
                      );
                      // Assuming you have a valid reqResObj
                      LoadTestController.processLoadTestResults(
                        reqResObj.id,
                        results
                      );
                      setIsTestRunning(false);
                    }}
                    disabled={
                      isTestRunning ||
                      !reqResObj ||
                      !reqResObj.url ||
                      reqResObj.request.method !== 'GET'
                    }
                  >
                    Run
                  </button>
                  <span
                    className={`tooltip-text ${
                      isTestRunning ||
                      !reqResObj ||
                      !reqResObj.url ||
                      reqResObj.request.method !== 'GET'
                        ? 'show-tooltip'
                        : 'hide-tooltip'
                    }`}
                  >
                    {getDisabledReason()}
                  </span>
                </div>
                <button
                  className={`button is-small is-danger ${
                    isDark ? '' : 'is-outlined'
                  } button-padding-vertical button-hover-color ml-3`}
                  onClick={() => {
                    if (abortController) {
                      abortController.abort();
                      setAbortController(null);
                    }
                    setScheduledTests(false);
                  }}
                >
                  Stop
                </button>
              </div>
            </div>
            <div>
              Attention: This load test is specifically designed for HTTP GET
              requests and is intended for backend testing purposes only. Please
              be aware that running this test on websites may lead to CORS
              issues.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(TestContainer);
