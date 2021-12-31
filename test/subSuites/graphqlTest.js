const chai = require('chai');
const composerObj = require('../pageObjects/ComposerObj.js');
const workspaceObj = require('../pageObjects/WorkspaceObj.js');
const app = require('../testApp.js');
const graphqlServer = require('../graphqlServer');

const { expect } = chai;

module.exports = () => {
  describe('GraphQL requests', () => {
    const fillGQLRequest = async (
      url,
      method,
      body = '',
      variables = '',
      headers = [],
      cookies = []
    ) => {
      try {
        // click and check GRAPHQL
        await (await composerObj.selectedNetwork).click();
        await (await app.client.$('a=REST')).click();
        await (await composerObj.selectedNetwork).click();
        await (await app.client.$('a=GRAPHQL')).click();

        // click and select METHOD if it isn't QUERY
        if (method !== 'QUERY') {
          await (await app.client.$('span=QUERY')).click();
          await (await app.client.$(`a=${method}`)).click();
        }

        // type in url
        await (await composerObj.url).setValue(url);

        // set headers
        headers.forEach(async ({ key, value }, index) => {
          await (await app.client
            .$(`\/\/*[@id="header-row${index}"]/input[1]`)
          ).setValue(key);
          await (await app.client
            .$(`\/\/*[@id="header-row${index}"]/input[2]`)
          ).setValue(value);
          await (await app.client.$('button=+ Header')).click();
        });

        // set cookies
        cookies.forEach(async ({ key, value }, index) => {
          await (await app.client
            .$(`\/\/*[@id="cookie-row${index}"]/input[1]`)
          ).setValue(key);
          await (await app.client
            .$(`\/\/*[@id="cookie-row${index}"]/input[2]`)
          ).setValue(value);
          await (await app.client.$('button=+ Cookie')).click();
        });

        // select Body and type in body
        await composerObj.clearGQLBodyAndWriteKeys(body);

        // select Variables and type in variables
        await composerObj.clickGQLVariablesAndWriteKeys(variables);
      } catch (err) {
        console.error(err);
      }
    };

    const addAndSend = async () => {
      try {
        await (await composerObj.addRequestBtn).click();
        await (await workspaceObj.latestSendRequestBtn).click();
      } catch (err) {
        console.error(err);
      }
    };

    before(() => {
      app.client.$('button=Clear Workspace').then((e) => e.click());
    });

    after(() => {
      try {
        graphqlServer.close();
        console.log('graphqlServer closed');
      } catch (err) {
        console.error(err);
      }
    });

    // it('it should be able to introspect the schema (PUBLIC API)', async () => {
    //   try {
    //     // click and check GRAPHQL
    //     await (await composerObj.selectedNetwork).click();
    //     await (await app.client.$('a=GRAPHQL')).click();

    //     // type in url
    //     await (
    //       await composerObj.url
    //     ).setValue('https://countries.trevorblades.com/');

    //     // click introspect
    //     await (await app.client.$('button=Introspect')).click();

    //     await new Promise((resolve) => {
    //       setTimeout(async () => {
    //         try {
    //           const introspectionResult = await (
    //             await app.client.$('#gql-introspection')
    //           ).getText();
    //           expect(introspectionResult).to.include(`CacheControlScope`);
    //           resolve();
    //         } catch (err) {
    //           console.error(err);
    //         }
    //       }, 1000);
    //     });
    //   } catch (err) {
    //     console.error(err);
    //   }
    // });

    // it('it should be able to create queries using variables (PUBLIC API)', async () => {
    //   try {
    //     const method = 'QUERY';
    //     const url = 'https://countries.trevorblades.com/';
    //     const query = 'query($code: ID!) {country(code: $code) {capital}}';
    //     const variables = '{"code": "AE"}';

    //     // type in url
    //     await fillGQLRequest(url, method, query, variables);
    //     await addAndSend();

    //     await new Promise((resolve) => {
    //       setTimeout(async () => {
    //         try {
    //           const events = await (
    //             await app.client.$('#events-display')
    //           ).getText();
    //           expect(events).to.include('Abu Dhabi');
    //           resolve();
    //         } catch (err) {
    //           console.error(err);
    //         }
    //       }, 1000);
    //     });
    //   } catch (err) {
    //     console.error(err);
    //   }
    // });

    it('it should give you the appropriate error message with incorrect queries (LOCAL API)', async () => {
      try {
        const method = 'QUERY';
        const url = 'http://localhost:4000/graphql';
        const query = 'query {feed {descriptions}}';

        // type in url
        await fillGQLRequest(url, method, query);
        await addAndSend();

        await new Promise((resolve) => {
          setTimeout(async () => {
            try {
              const statusCode = await (
                await app.client.$('.status-tag')
              ).getText();
              const events = await (
                await app.client.$('#events-display')
              ).getText();

              expect(statusCode).to.equal('Error');
              expect(events).to.include('"message": "Cannot query field');
              resolve();
            } catch (err) {
              console.error(err);
            }
          }, 1000);
        });
      } catch (err) {
        console.error(err);
      }
    });

    it('it should work with mutations (LOCAL API)', async () => {
      try {
        const method = 'MUTATION';
        const url = 'http://localhost:4000/graphql';
        const query =
          'mutation {post(url: "www.piedpiper.com" description: "Middle-out compression") {url}}';

        // type in url
        await fillGQLRequest(url, method, query);
        await addAndSend();

        await new Promise((resolve) => {
          setTimeout(async () => {
            try {
              const statusCode = await (
                await app.client.$('.status-tag')
              ).getText();
              const events = await (
                await app.client.$('#events-display')
              ).getText();

              expect(statusCode).to.equal('Success');
              expect(events).to.include('www.piedpiper.com');
              resolve();
            } catch (err) {
              console.error(err);
            }
          }, 1000);
        });
      } catch (err) {
        console.error(err);
      }
    });

  //   it('it should work with subscriptions (LOCAL API)', async () => {
  //     try {
  //       // START SUBSCRIPTION
  //       const method = 'SUBSCRIPTION';
  //       const url = 'http://localhost:4000/graphql';
  //       const query = 'subscription {newLink {id description}}';

  //       await fillGQLRequest(url, method, query);
  //       await addAndSend();

  //       // SEND MUTATION
  //       const method2 = 'MUTATION';
  //       const url2 = 'http://localhost:4000/graphql';
  //       const query2 =
  //         'mutation {post(url: "www.gavinbelson.com" description: "Tethics") {url}}';

  //       await fillGQLRequest(url2, method2, query2);
  //       await addAndSend();

  //       await new Promise((resolve) => {
  //         setTimeout(async () => {
  //           try {
  //             await (await app.client.$('#view-button-3')).click();

  //             const statusCode = await (
  //               await app.client.$('.status-tag')
  //             ).getText();
  //             const events = await (
  //               await app.client.$('#events-display')
  //             ).getText();

  //             expect(statusCode).to.equal('Success');
  //             expect(events).to.include('Tethics');
  //             resolve();
  //           } catch (err) {
  //             console.error(err);
  //           }
  //         }, 1000);
  //       });
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   });
  });
};
