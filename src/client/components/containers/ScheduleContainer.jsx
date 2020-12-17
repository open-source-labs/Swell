import React, { useState } from "react";
import ReqResCtrl from "../../controllers/reqResController.js";
import ScheduleReqResContainer from "./ScheduleReqResContainer.jsx";

export default function ScheduleContainer() {
  const [scheduleInterval, setScheduleInterval] = useState(1);
  const [runScheduledTests, setScheduledTests] = useState(false);

  return (
    <div>
        <input
          className="ml-1 input input-is-medium is-info"
          style={{maxWidth: "15vh"}}
          type="number"
          min="1"
          value={scheduleInterval}
          onChange={(e) => {setScheduleInterval(e.target.value)}}
        />
      <button
        className="button is-small is-primary is-outlined button-padding-vertical button-hover-color ml-3"
        onClick={() => {setScheduledTests(true)}}
        >
          Run
      </button>
      <button
        className="button is-small is-danger is-outlined button-padding-vertical button-hover-color ml-3"
        onClick={() => {setScheduledTests(false)}}
        >
          Stop
      </button>
      {runScheduledTests &&
        <ScheduleReqResContainer
        scheduleInterval={scheduleInterval}
        runScheduledTests={runScheduledTests}
        setScheduledTests={setScheduledTests}
        />
      }

    </div>
  );
}
