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

module.exports = { clearAndFillTestScriptArea };

