import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ScheduleReqResContainer from './ScheduleReqResContainer.jsx';
import StoppedContainer from './StoppedContainer.jsx';
import ReqResContainer from './ReqResContainer.tsx';

function ScheduleContainer() {
  const [scheduleInterval, setScheduleInterval] = useState(1);
  const [runScheduledTests, setScheduledTests] = useState(false);
  const isDark = useSelector((state) => state.ui.isDark);

  return (
    <div>
      <div className="is-flex is-flex-direction-row is-justify-content-center is-align-items-center mt-2">
        <div className="is-flex is-flex-direction-row is-justify-content-center is-align-items-center">
          <span className="mr-2" style={{ fontWeight: 'bold' }}>
            <p>Frequency</p>
            <p>(Seconds):</p>
          </span>
          <input
            className={`${
              isDark ? 'is-dark-200' : ''
            } ml-1 input input-is-medium is-info`}
            style={{ width: '65px' }}
            type="number"
            // min="1"
            value={scheduleInterval}
            onChange={(e) => {
              setScheduleInterval(e.target.value);
            }}
          />
        </div>
        <div className="ml-2">
          <button
            className={`button is-small is-primary ${
              isDark ? '' : 'is-outlined'
            } button-padding-vertical button-hover-color ml-3`}
            onClick={() => {
              setScheduledTests(true);
            }}
          >
            Run
          </button>
          <button
            className={`button is-small is-danger ${
              isDark ? '' : 'is-outlined'
            } button-padding-vertical button-hover-color ml-3`}
            onClick={() => {
              setScheduledTests(false);
            }}
          >
            Stop
          </button>
        </div>
      </div>
      <div className="m-1">
        <ReqResContainer displaySchedule={false} />
      </div>
      {runScheduledTests && (
        <ScheduleReqResContainer scheduleInterval={scheduleInterval} />
      )}
      {!runScheduledTests && <StoppedContainer />}
    </div>
  );
}

export default ScheduleContainer;
