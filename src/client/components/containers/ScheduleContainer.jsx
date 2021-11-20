import React, { useState } from 'react';
import ScheduleReqResContainer from './ScheduleReqResContainer.jsx';
import StoppedContainer from './StoppedContainer.jsx';
import ReqResContainer from './ReqResContainer.jsx';

function ScheduleContainer() {
  const [scheduleInterval, setScheduleInterval] = useState(1);
  const [runScheduledTests, setScheduledTests] = useState(false);

  return (
    <div>
      <div className="is-flex is-flex-direction-row is-justify-content-center is-align-items-center mt-2">
        <div className="is-flex is-flex-direction-row is-justify-content-center is-align-items-center mr-2">
          <span className="mr-2" style={{ fontWeight: 'bold' }}>
            Frequency (Seconds):
          </span>
          <input
            className="is-dark-mode ml-1 input input-is-medium is-info"
            style={{ maxWidth: '15vh' }}
            type="number" 
            min="1"
            value={scheduleInterval}
            onChange={(e) => {
              setScheduleInterval(e.target.value);
            }}
          />
        </div>
        <div className="ml-2">
          <button
            className="button is-small is-primary is-outlined button-padding-vertical button-hover-color ml-3"
            onClick={() => {
              setScheduledTests(true);
            }}
          >
            Run
          </button>
          <button
            className="button is-small is-danger is-outlined button-padding-vertical button-hover-color ml-3"
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
