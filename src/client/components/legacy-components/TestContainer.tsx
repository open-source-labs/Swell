import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ScheduleReqResContainer from './ScheduleReqResContainer';
import StoppedContainer from './StoppedContainer';
import ReqResContainer from './ReqResContainer';
import { simpleLoadTest } from './LoadTest';

interface ScheduleContainerProps {}

const ScheduleContainer: React.FC<ScheduleContainerProps> = () => {
  const [scheduleInterval, setScheduleInterval] = useState<number>(1);
  const [runScheduledTests, setScheduledTests] = useState<boolean>(false);
  const [concurrentUsers, setConcurrentUsers] = useState<number>(1);
  const [callsPerSecond, setCallsPerSecond] = useState<number>(1);
  const [totalTime, setTotalTime] = useState<number>(10);
  const [userUrl, setUserUrl] = useState<string>('');
  const isDark = useSelector((state: any) => state.ui.isDark);

  return (
    <div>
      <div className="is-flex is-flex-direction-row is-justify-content-center is-align-items-center">
        <p>URL:</p>
        <input
          className={`${isDark ? 'is-dark-200' : ''} ml-1 input is-info`}
          style={{ width: '65px' }}
          type="text"
          placeholder="URL"
          value={userUrl}
          onChange={(e) => {
            setUserUrl(e.target.value);
          }}
        />
      </div>
      <div className="is-flex is-flex-direction-row is-justify-content-center is-align-items-center mt-2">
        <div className="is-flex is-flex-direction-row is-justify-content-center is-align-items-center">
          <p>Users:</p>
          <input
            className={`${
              isDark ? 'is-dark-200' : ''
            } ml-1 input input-is-medium is-info`}
            style={{ width: '65px' }}
            type="number"
            placeholder="Users"
            value={concurrentUsers}
            onChange={(e) => {
              setConcurrentUsers(e.target.value);
            }}
          />
        </div>
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
          <button
            className={`button is-small is-primary ${
              isDark ? '' : 'is-outlined'
            } button-padding-vertical button-hover-color ml-3`}
            onClick={async () => {
              const results = await simpleLoadTest(
                userUrl,
                concurrentUsers,
                callsPerSecond,
                totalTime
              );
              console.log(results);
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
