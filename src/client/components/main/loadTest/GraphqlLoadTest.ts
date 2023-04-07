/**
 * Executes a simple load test against a specified URL.
 *
 * @param {string} url - The URL to send the requests to.
 * @param {number} requestsPerSecond - The number of requests per second each user should send.
 * @param {number} durationInSeconds - The duration of the test in seconds.
 *
 * @returns {Promise<Object>} An object containing the load test results, including total sent requests,
 *                            total received responses, total missed responses, and the average response time.
 *
 * @example

 * Right now Load test only does a HTTP fetch request because this is a copy from Fred's
// I've tweaked it to be able to accept a hard coded GraphQL query on lines 57
 * const testResults = await simpleLoadTest('https://countries.trevorblades.com/', 10, 5, 30, query)??
 * Also need to include request body when load testing
 */

import gql from 'graphql-tag';

export type GraphLoadTestResult = [
  { totalSent: number,
  totalReceived: number,
  totalMissed: number,
  averageResponseTime: number,
  totalNotSent: number,
  errorCounts: { [errorCode: string]: number } },
];

  
  export async function graphLoadTest(
    url: string,
    request: any,
    requestsPerSecond: number,
    durationInSeconds: number,
    
  ): Promise<GraphLoadTestResult> {
    // Initialize variables for start and end times of the load test.
    const startTest = performance.now();
    const endTest = startTest + durationInSeconds * 1000;
    // Calculate the delay between each request based on the desired requests per second.
    const delayBetweenRequests = 1000 / requestsPerSecond;
  
    // Initialize counters for sent, received, and missed requests, and for the total response time.
    let totalSent = 0;
    let totalReceived = 0;
    let totalMissed = 0;
    let totalResponseTime = 0;
    let totalNotSent = 0;
    const errorCounts: { [errorCode: string]: number } = {};
  
    // Define the sendRequest function, which sends a request to the target URL and updates the counters.
    const sendRequest = async () => {
      try {
        totalSent += 1;
        const startTime = performance.now();
        // this is knows it's a HTTP request post request in order to get graphQL query
        // reqResObject.request.body will body part => {continents{name code}}
        // reqResObject.request.method will have => QUERY
        // reqResObject.host will have the URL
        const requestBody = {
          query: `${request.body}`
        };
        // console.log('${JSON.stringify(request.method)} ${JSON.stringify(request.body)}', `${JSON.stringify(request.method)} ${JSON.stringify(request.body)}`);
        console.log('JSON.stringify(request.method request.body)', requestBody);
        const response = await fetch(url, {
            method:'POST',
            headers: {"Content-Type": "application/json"},
            body: requestBody
        })
        const endTime = performance.now();
        // If the response is successful (HTTP status 200-299), increment the totalReceived counter
        // and update the totalResponseTime.
        if (response.ok) {
          totalReceived += 1;
          totalResponseTime += endTime - startTime;
        } else {
          // If the response has a non-success status, increment the totalMissed counter.
          totalMissed += 1;
        }
      } catch (error) {
        const typedError = error as { code?: string; message: string };
        // Increment the count for the error code in the errorCounts object
        // this way the user gets all errors and can look up error code to see if code is 429: Too Many Requests
        const errorCode = typedError.code || typedError.message;
        if (errorCounts[errorCode]) {
          errorCounts[errorCode] += 1;
        } else {
          errorCounts[errorCode] = 1;
        }
      }
    };
  
    // Define the runUserLoad function, which simulates a single user sending requests to the target URL.
    const runUserLoad = async () => {
      // Keep sending requests until the end time of the load test is reached.
      while (performance.now() < endTest) {
        const startOfSecond: number = performance.now();
        let requestsThisSecond: number = 0;
  
        while (performance.now() - startOfSecond < 1000) {
          await sendRequest();
          requestsThisSecond++;
  
          // Wait for the calculated delay between requests before sending the next one.
          await new Promise((resolve) =>
            setTimeout(resolve, delayBetweenRequests)
          );
        }
  
        // Check if the desired number of requests were sent
        const desiredRequests: number = requestsPerSecond;
        const actualRequests: number = requestsThisSecond;
        if (actualRequests < desiredRequests) {
          totalNotSent += desiredRequests - actualRequests;
        }
      }
    };
  
    // Run the load test by calling the runUserLoad function.
    await runUserLoad();
  
    // Calculate the average response time based on the total response time and number of received responses.
    const averageResponseTime =
      totalReceived === 0 ? totalReceived : totalResponseTime / totalReceived;
  
    // Return the load test results as an object.
    return {
      totalSent,
      totalReceived,
      totalMissed,
      totalNotSent,
      errorCounts,
      averageResponseTime,
    };
  }