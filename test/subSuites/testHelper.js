/**
 * This module contains helper functions that facilitates with
 * filling in information, adding and sending requests in the UI
 * for E2E testing.
 */

const isButtonDisabled = async (page, path) => {
  const button = await page.locator(path);
  const isDisabled = await button.getAttribute('disabled');
  return isDisabled !== null;
};

const fillRestRequest = async (
  page,
  url,
  method,
  body = '',
  headers = [],
  cookies = []
) => {
  try {
    // Make sure HTTP2 method is selected
    const httpPath = 'button>> text=HTTP/2';
    if (!(await isButtonDisabled(page, httpPath)))
      await page.locator(httpPath).click();

    // click and select METHOD if it isn't GET
    if (method !== 'GET') {
      await page.locator('button#rest-method').click();
      await page.locator(`div[id^="composer"] >> a >> text=${method}`).click();
    }

    // type in url
    await page.locator('#url-input').fill(url);

    // set headers
    headers.forEach(async ({ key, value }, index) => {
      await page
        .locator(`#header-row${index} >> [placeholder="Key"]`)
        .fill(key);
      await page
        .locator(`#header-row${index} >> [placeholder="Value"]`)
        .fill(value);
      await page.locator('#add-header').click();
    });

    // set cookies
    cookies.forEach(async ({ key, value }, index) => {
      await page
        .locator(`#cookie-row${index} >> [placeholder="Key"]`)
        .fill(key);
      await page
        .locator(`#cookie-row${index} >> [placeholder="Value"]`)
        .fill(value);
      await page.locator('#add-cookie').click();
    });

    // Add BODY as JSON if it isn't GET
    if (method !== 'GET') {
      // select body type JSON
      if ((await page.locator('#body-type-select').innerText()) === 'raw') {
        await page.locator('#raw-body-type').click();
        await page.locator('.dropdown-item >> text=application/json').click();
      }

      // insert JSON content into body
      const codeMirror = await page.locator('#body-entry-select');
      await codeMirror.click();
      const restBody = await codeMirror.locator('.cm-content');

      try {
        restBody.fill('');
        await restBody.fill(body);
      } catch (err) {
        console.error(err);
      }
    }
  } catch (err) {
    console.error(err);
  }
};

const fillGQLBasicInfo = async (
  page,
  url,
  method,
  headers = [],
  cookies = []
) => {
  try {
    // click and check GRAPHQL
    const gqlPath = 'button>> text=GraphQL';
    if (!(await isButtonDisabled(page, gqlPath)))
      await page.locator(gqlPath).click();

    // click and select METHOD if it isn't QUERY
    if (method !== 'QUERY') {
      await page.locator('button#graphql-method').click();
      await page.locator(`div[id^="composer"] >> a >> text=${method}`).click();
    }

    // type in url
    await page.locator('#url-input').fill(url);

    // set headers
    headers.forEach(async ({ key, value }, index) => {
      await page
        .locator(`#header-row${index} >> [placeholder="Key"]`)
        .fill(key);
      await page
        .locator(`#header-row${index} >> [placeholder="Value"]`)
        .fill(value);
      await page.locator('#add-header').click();
    });

    // set cookies
    cookies.forEach(async ({ key, value }, index) => {
      await page
        .locator(`#cookie-row${index} >> [placeholder="Key"]`)
        .fill(key);
      await page
        .locator(`#cookie-row${index} >> [placeholder="Value"]`)
        .fill(value);
      await page.locator('#add-cookie').click();
    });
  } catch (err) {
    console.error(err);
  }
};

const fillGQLRequest = async (
  page,
  url,
  method,
  query = '',
  variables = '',
  headers = [],
  cookies = []
) => {
  try {
    await fillGQLBasicInfo(page, url, method, headers, cookies);

    // select Body, clear it, and type in query
    const codeMirror = await page.locator('#gql-body-entry');
    await codeMirror.click();
    const gqlBodyCode = await codeMirror.locator('.cm-content');

    try {
      await gqlBodyCode.fill('');
      await gqlBodyCode.fill(query);
    } catch (err) {
      console.error(err);
    }

    // select Variables and type in variables
    const codeMirror2 = await page.locator('#gql-var-entry');
    await codeMirror2.click();
    await codeMirror2.locator('.cm-content').fill(variables);
  } catch (err) {
    console.error(err);
  }
};

const fillgRPC_Proto = async (page, proto) => {
  try {
    
    // select Body, clear it, and type in query
    const codeMirror = await page.locator('#grpcProtoEntryTextArea');
    await codeMirror.click();
    const gRPC_BodyCode = await codeMirror.locator('.cm-content');

    try {
      await gRPC_BodyCode.fill('');
      await gRPC_BodyCode.fill(`${proto}`);
      await page.locator('#save-proto').click();
      await page.locator('#Select-Service-button').click();
      await page.locator('.dropdown-menu >> a >> text=Greeter').click();
      await page.locator('#Select-Request-button').click();
    } catch (err) {
      console.error(err);
    }

  } catch (err) {
    console.error(err);
  }
};

const addAndSend = async (page, n) => {
  try {
    await page.locator('button >> text=Add to Workspace').click();
    await page.locator(`#send-button-${n}`).click();
  } catch (err) {
    console.error(err);
  }
};

// Bring in the Clear & Fill Test Script Area for improved code readability.
const clearAndFillTestScriptArea = async (page, script) => {
  try {
    // click the view tests button to reveal the test code editor
    await page.locator('span >> text=View Assertion Tests').click();
    // set the value of the code editor to be some hard coded simple assertion tests

    const codeMirror2 = await page.locator('#test-script-entry');
    await codeMirror2.click();
    const scriptBody = await codeMirror2.locator('.cm-content');

    try {
      scriptBody.fill('');
      await scriptBody.fill(script);
    } catch (err) {
      console.error(err);
    }

    // Close the tests view pane.
    await page.locator('span >> text=Hide Assertion Tests').click();
  } catch (err) {
    console.error(err);
  }
};

const composerSetup = async () => {
  try {
    await page.locator('button>> text=GRPC').click();
    await page.locator('#url-input').fill('0.0.0.0:30051');


    const codeMirror = await page.locator('#grpcProtoEntryTextArea');
    await codeMirror.click();
    const grpcProto = await codeMirror.locator('.cm-content');
    await grpcProto.fill(proto);

    await page.locator('#save-proto').click();
  } catch (err) {
    console.error(err);
  }
};

const addReqAndSend = async (num) => {
  try {
    await page.locator('button >> text=Add to Workspace').click();
    await page.locator(`#send-button-${num}`).click();
    const res = await page.locator('#events-display').innerText();
    return res;
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  isButtonDisabled,
  fillRestRequest,
  fillGQLBasicInfo,
  fillGQLRequest,
  addAndSend,
  clearAndFillTestScriptArea,
  fillgRPC_Proto,
  composerSetup,
  addReqAndSend
};

