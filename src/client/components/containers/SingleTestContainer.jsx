import React from 'react'
import { Doughnut } from "react-chartjs-2";
import TestResult from './TestResult'

export default function SingleTestContainer({ currentResponse }) {
  const {
    request,
    response
  } = currentResponse;

  const { url } = currentResponse;

  const passFailScripts = [];

  let pass = 0;
  let fail = 0;

  if (response.testResult !== undefined && response.testResult !== null) {
    response.testResult.forEach((ele, idx) => {
      if (ele.status === 'PASS') pass += 1;
      else fail += 1;
      const test = <TestResult 
        key={`TestResult-${idx}`}
        id={`TestResult-${idx}`}
        status={ele.status}
        message={ele.message} />

      passFailScripts.push(test);
    });
  }

  const data = {
    datasets: [{data: [pass, fail], backgroundColor: ['#06a568', '#f66b61']}],
    labels: ['Passed','Failed'],
  };

  return (
  <>
    <div className="is-flex cards-titlebar mt-2 mx-2">
      <div className='is-flex-grow-1 is-rest is-flex-basis-0 is-flex is-justify-content-center is-align-items-center has-text-weight-medium'>
        Tests
      </div>
      <div className="is-flex-grow-2 is-size-7 is-flex-basis-0 is-flex is-align-items-center is-justify-content-space-between">
        <div className="is-flex is-align-items-center ml-2">{url}</div>
      </div>
    </div>
    <div className="is-neutral-200-box p-3 mx-2">
      <div>{passFailScripts}</div>
      <div className="border-top my-2 grid-graph">
        <div className="mt-4">
          <span style={{fontWeight: 'bold', fontSize: '1.25rem', marginLeft: '5vw'}}>Total Tests</span>
          <Doughnut 
            data={data} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              legend: {
                display: false,
              }
            }}
          />
        </div>
        <div style={{fontWeight: 'bold', fontSize: '3rem', marginTop: '10vh'}}>
          {pass + fail}
        </div>
        <div className="grid-graph-mt is-flex is-flex-direction-column is-justify-content-start is-align-items-start">
          <div className="my-8">
            <span className="has-background-success pass-fail-button">Passed:</span> <span className="ml-2">{pass}</span>
          </div>
          <div className="my-4">
            <span className="has-background-danger pass-fail-button">Failed:</span> <span className="ml-2">{fail}</span>
          </div>
        </div>
      </div>
    </div>
  </>
  )
}