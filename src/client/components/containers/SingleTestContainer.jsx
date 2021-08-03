import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import TestResult from './TestResult';
import VerticalProgress from '../display/testResultsAnimated';

export default function SingleTestContainer({ currentResponse }) {
  const { request, response } = currentResponse;

  const { url } = currentResponse;

  const passFailScripts = [];

  let pass = 0;
  let fail = 0;

  if (response.testResult !== undefined && response.testResult !== null) {
    response.testResult.forEach((ele, idx) => {
      if (ele.status === 'PASS') pass += 1;
      else fail += 1;
      const test = (
        <TestResult
          key={`TestResult-${idx}`}
          id={`TestResult-${idx}`}
          status={ele.status}
          message={ele.message}
        />
      );

      passFailScripts.push(test);
    });
  }

  const data = {
    datasets: [{ data: [pass, fail], backgroundColor: ['#06a568', '#f66b61'] }],
    labels: ['Passed', 'Failed'],
  };

  return (
    <>
      <div className="is-flex cards-titlebar mt-2 mx-2">
        <div className="is-flex-grow-1 is-rest is-flex-basis-0 is-flex is-justify-content-center is-align-items-center has-text-weight-medium">
          Tests
        </div>
        <div className="is-flex-grow-2 is-size-7 is-flex-basis-0 is-flex is-align-items-center is-justify-content-space-between">
          <div className="is-flex is-align-items-center ml-2 is-size-7">
            {url}
          </div>
        </div>
      </div>
      <div className="is-neutral-200-box p-3 mx-2">
        {/* <div>{passFailScripts}</div> */}
        <div className="mt-2">
          <center className="test-results mb-2">Summary</center>
        </div>
        <div>
          <div className="border-top mb-2">
            {/* Test Results Graph */}
            <center>
              <VerticalProgress total={pass + fail} pass={pass} open={open} />
            </center>
          </div>
          {/* Test Results Pass + Fail */}
          <center>
            <div className="is-flex is-flex-direction-column">
              <div className="pass-fail-total mt-5">
                Total Tests:{' '}
                <span className="pass-fail-total-number">{pass + fail}</span>
              </div>
              <div className="pass-fail-percentage mb-3">
                Percentage Passed:{' '}
                <span className="pass-fail-total-number">
                  {Math.floor((pass / (pass + fail)) * 100)}%
                </span>
              </div>
              <div className="is-flex align-self-end">
                <div>
                  <span className="has-background-success pass-fail-button">
                    Passed:
                  </span>{' '}
                  <span className="ml-2">{pass}</span>
                </div>
                <div className="ml-5">
                  <span className="has-background-danger pass-fail-button">
                    Failed:{' '}
                  </span>{' '}
                  <span className="ml-2">{fail}</span>
                </div>
              </div>
              <div className="is-neutral-200-box p-3 mx-2">
                <div>{passFailScripts}</div>
              </div>
            </div>
          </center>
        </div>
      </div>
    </>
  );
}
