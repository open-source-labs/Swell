import React from 'react';
import { Box, List, ListItem, Stack } from '@mui/material';

export default function SingleTestContainer({ currentResponse }) {
  const { response } = currentResponse;

  const { url } = currentResponse;

  const passFailScripts = [];

  let pass = 0;
  let fail = 0;

  if (response.testResult !== undefined && response.testResult !== null) {
    response.testResult.forEach((ele, idx) => {
      const { status, message } = ele;
      if (status === 'PASS') pass += 1;
      else fail += 1;
      const testResultElement = (
        <ListItem
          key={`TestResult-${idx}`}
          sx={{ padding: '8px', display: 'flex', justifyContent: 'start' }}
        >
          <div
            className={
              status === 'PASS'
                ? 'pass-fail-button-success'
                : 'pass-fail-button-failure'
            }
            id={`TestResult-${idx}-status`}
          >
            <strong>{status}</strong>
          </div>
          <div id={`TestResult-${idx}-message`} className="pass-fail-response">
            {message}
          </div>
        </ListItem>
      );

      passFailScripts.push(testResultElement);
    });
  }

  return (
    <>
      <Box className="is-flex cards-titlebar mt-2 mx-2">
        <div className="is-flex-grow-1 is-rest is-flex-basis-0 is-flex is-justify-content-center is-align-items-center has-text-weight-medium">
          Tests
        </div>
        <div className="is-flex-grow-2 is-size-7 is-flex-basis-0 is-flex is-align-items-center is-justify-content-space-between">
          <div className="is-flex is-align-items-center ml-2 is-size-7">
            {url}
          </div>
        </div>
      </Box>
      <Box className="is-neutral-200-box p-3 mx-2">
        <Stack className="mt-2">
          <center className="test-results mb-2">Summary</center>
        </Stack>
        {/* Test Results Pass + Fail */}
        <Stack>
          <section className="is-flex is-flex-direction-column">
            <article className="pass-fail-total">
              <span>Total Tests: </span>
              <span className="pass-fail-total-number">{pass + fail}</span>
            </article>
            <article className="pass-fail-percentage mb-3">
              <span>Percentage Passed: </span>
              <span className="pass-fail-total-number">
                {Math.floor((pass / (pass + fail)) * 100)}%
              </span>
            </article>
            <article className="is-flex align-self-end">
              <div className="pass-fail-button-success">
                <span>Passed:</span>
                <span className="ml-3">
                  <strong>{pass}</strong>
                </span>
              </div>
              <div className="ml-3 mr-3 pass-fail-button-failure">
                <span>Failed:</span>
                <span className="ml-3">
                  <strong>{fail}</strong>
                </span>
              </div>
            </article>
            <List className="is-neutral-200-box p-3 mx-2">
              {passFailScripts}
            </List>
          </section>
        </Stack>
      </Box>
    </>
  );
}
