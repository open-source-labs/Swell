/**
 * Executes a simple load test against a specified URL.
 *
 * @param {string} url - The URL to send the requests to.
 * @param {number} concurrentUsers - The number of concurrent users to simulate.
 * @param {number} requestsPerSecond - The number of requests per second each user should send.
 * @param {number} durationInSeconds - The duration of the test in seconds.
 *
 * @returns {Promise<Object>} An object containing the load test results, including total sent requests,
 *                            total received responses, total missed responses, and the average response time.
 *
 * @example
 * const testResults = await simpleLoadTest('https://api.example.com/data', 10, 5, 30);
 * console.log(testResults);
 */

interface LoadTestResult {
  totalSent: number;
  totalReceived: number;
  totalMissed: number;
  averageResponseTime: number;
}

export async function simpleLoadTest(
  url: string,
  concurrentUsers: number,
  requestsPerSecond: number,
  durationInSeconds: number
): Promise<LoadTestResult> {
  const startTime = Date.now();
  const endTime = startTime + durationInSeconds * 1000;
  const delayBetweenRequests = 1000 / requestsPerSecond;

  let totalSent = 0;
  let totalReceived = 0;
  let totalMissed = 0;
  let totalResponseTime = 0;

  const sendRequest = async () => {
    try {
      totalSent += 1;
      const startTime = Date.now();
      const response = await fetch(url);
      const endTime = Date.now();
      if (response.ok) {
        totalReceived += 1;
        totalResponseTime += endTime - startTime;
      } else {
        totalMissed += 1;
      }
    } catch (error) {
      totalMissed += 1;
    }
  };

  const runUserLoad = async () => {
    while (Date.now() < endTime) {
      await sendRequest();
      await new Promise((resolve) => setTimeout(resolve, delayBetweenRequests));
    }
  };

  const userPromises = Array(concurrentUsers)
    .fill(null)
    .map(() => runUserLoad());

  await Promise.all(userPromises);

  const averageResponseTime = totalReceived === 0 ? 0 : totalResponseTime / totalReceived;

  return {
    totalSent,
    totalReceived,
    totalMissed,
    averageResponseTime,
  };
}
