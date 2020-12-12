import React from 'react'
import TestResult from './TestResult'
import { Doughnut } from "react-chartjs-2";

export default function SingleTestContainer({ currentResponse }) {

  const {
    request,
    response
  } = currentResponse;

  let data = {
    datasets: [{data: [10, 20], backgroundColor: ['#06a568', '#f66b61']}],
    labels: ['Passed','Failed']
  };

  const url = currentResponse.url;

  const passFailScripts = [];

  if (response.testResult !== undefined && response.testResult !== null) {
    response.testResult.forEach(ele => {
      const test = <TestResult status={ele.status} message={ele.message} />
      passFailScripts.push(test);
    })
  }


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
      <Doughnut data={data} />
    </div>
  </>
  )
}