# Contributing to Swell in the context of a group/medium-term project

If you are considering contributing to Swell in the context of a group or medium-term project, you are at the right place! Here is a document that will give you more information regarding the state of the product and some considerations for future iteration.

NOTE: Here is a super useful excalidraw that describes the processes of the application in detail: https://excalidraw.com/#room=18f1f977e8cd6361eaa1,4vr1DznwcnD-uKM_X7ZhiA

---

## As a developer, what experience can you get out of contributing to Swell?

- TypeScript + JavaScript
- React
- Redux
- SASS
- Node
- Express
- Webpack
- Client-side storage (IndexedDB)
- GitHub Actions (CI/CD)
- Testing
  - Unit testing with Jest
  - End-to-end (E2E) testing with Playwright and Mocha
- Advanced and/or specialized knowledge of:
  - Electron
  - APIs: HTTP/2, GraphQL
  - API served over streaming technologies:
    - Server-Sent Events (SSE)
    - WebSockets
    - gRPC
    - tRPC
    - WebRTC
    - OpenAPI

## How to download and test the application locally?

1. Fork and/or clone the repository into your local machine
2. In your terminal:
   - `npm install`, then
   - `npm run dev`
3. Wait for the electron application to start up (it may take a bit)

There is E2E testing available via `npm run test`. Note that not all tests in the E2E test suite work currently. Please refer to `./test/testSuite.js` and `./test/subSuites` for more details.

---

## What is the way to render an electron app during development for WSL users?

WSL and Electron do not work well together - the application won't load when using `npm run dev`. We have a few solutions you can try, but it is not by any means the only way or even guaranteed method.

- One solution suggestion is to download the repo directly on your Windows machine and not use WSL.
  - You can right-click on the bottom-left of your VSCode and uncheck the remote host so that you still get the command-line functionalities.
- Another solution is to use `Xserver` (graphical interface for Linux) to render things from Linux onto your Windows.
  - [This article](https://www.beekeeperstudio.io/blog/building-electron-windows-ubuntu-wsl2) was really helpful in getting things to work
  - There is another article [here](https://skeptric.com/wsl2-xserver/) that you may want to check out. The two differences that diverge from the article instructions on the WSL Config step with `.bashrc` file and the `VcsXsrv` config step 3
    - inside of your `.bashrc` File:
      - You should add the following script instead of what they put: `export DISPLAY=$(/sbin/ip route | awk '/default/ { print $3 }'):0`
    - `VcsXsrv`: check Disable access control as well.
  - After these steps, you will have to enable WSL to access `Xserver` on Windows Firewall(refer to the [skeptric](https://skeptric.com/wsl2-xserver/) article)
  - If `x11 calc` is able to pop up, it means everything is working well.
- There is a long load time when running the server, it may take a few minutes.

---

## What is the current state of the application?

From a functionality standpoint:

- Consistent UI/UX styling and color palette
- Make requests via HTTP/2
- Query, Mutation, Subscribe/unsubscribe to GraphQL endpoints
- Query, Mutation, Subscribe/unsubscribe to tRPC endpoints
- HTTP/2 stress testing with `GET` requests
- GraphQL stress testing with `Query`
- Mock server for HTTP/2 (`Express`)
- Ability to store historical requests and create/delete workspaces
- Frontend conversion to TypeScript
- From a codebase standpoint:

- Increase the quality of TypeScript and continue conversion
- Conversion to Redux toolkit _almost_ complete (need to implement hooks like useSelector and useAppDispatch)
- Most working E2E testing (more details in `./test/testSuite.js`)

---

## What are some of the features that require future iterations?

### _Continue reducing the size and complexity of the codebase_

This codebase has an interesting combination of over-modularization and code de-centralization/duplication occurring at the same time. For example - each type of API endpoint composer window (top right section of the app) is its own module/file, but a lot of the code inside is duplicated (see `Http2Composer.tsx` and `GraphQLComposer.tsx`).
The reason many iteration groups have stayed away is because one would need to craft a function/component that is flexible enough to handle the population of the reqRes object and dispatch the state to the various slices. This is not an easy task and may take the entire iteration time allotted. It would be a worthy
The impacts to the product are:

- The codebase can be incredibly difficult to navigate if you are not familiar with the structure
  - That being said, the file structure has been extensively modified to make the navigation much easier.
    The most challenging aspects are the understanding how state flows through the application, from the front-end to main_process, controllers, etc.
    This is the most important thing to understand when iterating on Swell
- The app is slow to load in all environments (production, development, test)
  - Adding multiple entry points to the build process would greatly improve this, but be careful because you can end up making performance much worse in the process

**Some of us have found [ReacTree](https://reactree.dev/) VS Code extension incredibly helpful in visualizing the UI components. Utilizing the extension could be your entry into understanding the structure of the codebase.**

**Some of us have found Redux Dev Tools incredibly helpful when trying to understand the flow of state and actions. Redux Dev Tools is installed when running in development mode and can be accessed as the right-most tab in your developer console panel in Electron.**

As you iterate the product, keep in mind the footprint your new feature(s) could add to the codebase. Could you re-use some of the existing modules? Can you even refactor and/or remove the obsolete code to help maintain the health of the codebase?

There are many parts of the codebase that break DRY principles, and with such a large application, really keep in mind that when you add features it is completely necessary. Past iterators added an experimental feature(s) without it fully working and the next team(s) would add their own experimental feature. Fixing features the past teams couldn't get to not only is a great way to learn these technologies but is also a great thing to talk about in interviews. " I fixed the webRTC feature that has been stagnant for 5 years", "I addressed the technical debt and reorganized the state...", or "Increased the quality of typeScript". These all show maturity as a developer and will allow us to focus the entire time of OSP on the 20% problems.

### _Ensure consistent redux state management_

The redux state initiation and management for various API endpoints in this codebase are inconsistent. If you cross reference the state initialization, transition/update, and clean up in various modules with `types.ts`, you will notice many TypeScript typing errors due to inconsistent state management. This will need to be cleaned up bit by bit to ensure a state that works across all types of APIs in this application.

### _Basic functionality for more advanced APIs not working as expected_

For the following technologies - if you reference the gifs in `readme` and try to replicate the steps in the application you may not get the same result:

<!-- - gRPC -->

<!-- - tRPC -->

- OpenAPI

If future groups have a desire to iterate on the above features, please ensure the basic functionality works as expected, and update E2E testing in `./test/testSuite.js` before adding new features.

### _Continue improving UX/UI consistency in the app_

The UX/UI styling and functionality are not consistent across different API endpoints. For example, there is a `Send Request` button for HTTP/2, but not for GraphQL.

Moreover, the application lacks instructions on how to utilize some of the more advanced features like WebSocket and tRPC. Having some written explanation of how the feature works on the app would be tremendously helpful.

Lastly, when making the app smaller on a Windows desktop or using a computer with a smaller screen size, some of the buttons are partially cut out. It would be great to establish a minimum size for each section and/or input field so the application can auto-resize elegantly.

You will notice that there are a few places where MUI is used. Material UI is a huge component library that is popular, though figuring out how to lessen Swell's dependence on it would go a long way to reducing its bloat.

### _Continue conversion to TypeScript and Redux toolkit_

TypeScript provides strong typing to improve code quality, and maintainability and reduce runtime errors. Redux toolkit reduces the amount of boilerplate required to use Redux within the application and provides a centralized environment for state initialization and management.

### _Enhance HTTP/2 Mock server functionality_

Currently, the HTTP/2 mock server has the ability to create a server that is accessible outside of the application and create any endpoint that the user chooses. There could be a lot of potential to enhance the current mock server to include features such as:

- Add an option to see the list of existing routes that show up in the response window
- Add endpoint validation
- the ability to mock HTML responses (or remove the HTML option from the BodyEntryForm component)
- Connect the headers and cookies to the mock endpoint creation

### _WebRTC features are there but buggy when interacting with other parts of the app_

In the latest iteration, the WebRTC feature was changed from STUN Server testing to Client RTC Connection testing, allowing Swell to test if another client is able to create an RTC connection to transmit text and video data. Because the RTCPeerConnection has to be initiated before we generate the SDP, this connection is set up differently from the other networks. Other networks purely need the primitive strings as input, and the response is created on click of `Send` (in the workspace panel). For WebRTC, the connection object is created as an input, and when the user clicks `Send` then the data transmitted data is allowed to be displayed (although data is being transmitted through the connection even before `Send` is clicked). This means the WebRTC ReqRes can't really be saved in history or re-connected beyond the first connection.

Areas for improvement:

- Currently, our WebRTC only works as the connection initiator. The next step would be the `Add Answer` button which allows Swell to be on the receiver end of the connection.
- Currently, our WebRTC end-to-end testing is read-only from the previous implementation. It would be a highly valuable addition to modify the old testing to test the current implementation of webRTC. Integration testing has been started but needs to be finished. Relevant files include
  - End-to-End:'test/**tests**/subSuites/webRTCTest.js'
  - Integration: 'test/**tests**/IntegrationTests/webRTCIntegrationTests'

### _Incomplete E2E testing coverage_

Some of the following features either have broken, incomplete or no E2E testing coverage in the repository:

- webRTC
- tRPC
- OpenAPI
- Mock server

Future iterations should consider fixing or adding E2E testing coverage for these features.

### _Integration Testing_

WebRTC integration testing has minor bugs to be ironed out, causing timeout issues. Integration testing is currently Swell's only way of making sure front-end user interaction appropriately interacts with Redux state management. 

Additionally, with GraphQL, the specific test that verifies Stress Test functionality is a bit inconsistent. When Stress Test is initiated, Redux toolkit will allow you to track the amount of tests being sent out, missed, and received via Redux state information. For some reason, there is a difference in outcomes between when the Stress Test is initiated through integration tests vs. when initiated through the interface as a user. When initiated (at least in GraphQL) through integration tests, you can see X number of stress tests sent out, but all of them will be missed and none received. When initiating the Stress Test using Swell's interface, you will see X number of stress tests sent out, and the same X number of stress tests received. We're unsure of why this is happening. The current 'Stress Test' section of GraphQL integration testing only tracks the number of stress tests sent out and passes if that number is updated on the Redux state. Ideally, to confirm successful Stress Test functionality, we would want to track the number of stress tests sent out and confirm it with the number of stress tests received within the Redux state. It seems to be consistent in HTTP, but not in GraphQL. Also, there is currently no 'Stress Test' section in integration testing for Websockets. 

Finally, if future iterators would like to completely cover the list of API-testing protocols with integration testing - there is still HTTP/2 and tRPC integration testing to be made. 

---

## CI/CD Pipeline

### _How it works_

Continuous Integration and Continuous Development have been implemented using GitHub Actions. Here are some things to keep in mind regarding the process:

- CI tests will automatically run on any pull request
- CD packages will deploy on a successful merge request to the master branch. This will automatically deploy the packages in the GitHub Releases tab. It will create the release based on the version number so make sure the version number is correct in the codebase.
- CD packages will deploy on EACH merge request to the master branch. Changes made to the master branch should be the final changes. However if multiple merge requests are accept to the master branch, it will create multiple releases. Please keep this in mind and delete the extra releases that are created.
  
In order to successfully enable the Continuous Development pipeline, do the following:
1. Create a personal GitHub Token (User Settings -> Developer Settings  -> Tokens)
2. Ensure the following are selected for the token: repo (All), workflow, write:packages, user:email
3. Copy the personal token generated
4. Add the token to your repos secrets (Settings -> Secrets and Variables -> Actions -> Repository Secret)
After following these steps, Github Actions should have the proper permissions to write to Github Releases. This should create a draft of the release with the necessary files.

You should also ensure the repo information is correct in package.json. Look at the section "publish" and ensure that the information is correct.

The file for the CD workflow is createPackages.yml. Currently, it is set to run on pushing to the 'master' branch. I recommend changing this to 'dev' for testing purposes and changing it back to 'master' once the testing is complete.

The following is an alternative approach to testing new workflows before using them on critical branches like main and dev:

- Create two test branches (ex: ci-draft and ci-main)
- Define a workflow in a yaml file and test its execution by pushing it to ci-draft and/or opening a pull request to merge ci-draft into ci-main depending on the triggers you have defined in the workflow
- Make any necessary adjustments to the workflow and continue testing it on ci-draft and ci-main until the workflow is functioning as intended
- Finally, open a pull request to merge the new workflow into the dev and/or main branches

The idea is to troubleshoot new workflows before applying them to the dev or main branches.

### _Improvements to the CI/CD pipeline_

- Currently, only the Unit Tests are implemented for the CI pipeline. The integration and E2E tests use the playwright library and an electron window in order to emulate the front-end user inputs. This has been causing issues with GitHub Actions so we did not add these tests to the CI pipeline. There may be an alternative solution to implement it through Github Actions or even through other tools such as Docker.
- As previously stated, each successful merge request to the master branch. Multiple of these will cause multiple releases to deployed. A future iteration could look into this so rather than creating a new release each time, it would update an existing draft if one exists.

### _How can I package and release the application without a functional CD pipeline?_

Before the CD workflow was implemented, the packages were manually bundled and deployed for each Operating System. The following section describes how to manually package and deploy the application.

There are a few options to package an electron app for production. Some of the most popular options are electron forge and electron builder, and Swell uses electron builder currently.

If you choose to package the application locally, by default the packaged app is intended for the same local environment - meaning if you packaged the app on MacOS, the installer would be intended for MacOS environments.

While electron builder supports [multi-platform build](https://www.electron.build/multi-platform-build.html), there are some limitations when building locally.

For Mac users, running `npm run package-mac` and `npm run package-win` (as defined in `package.json`) would allow you to package the Swell app for Mac and Windows environments. If you try to package for the Linux environment (i.e. `npm run package-all`, `npm run package-linux`, `npm run gh-publish`), you will run into issues requiring `snapcraft` and `multipass` to create a Linux virtual machine in order to package the application. You can try to install `snapcraft` and `multipass` via `brew` per instructions, but there has not been much success locally.

The only remaining option to build a Linux package for MacOS users is via the CI/CD pipeline or through asking a developer with WSL or Linux environment to package the application.

- Ask the developer to clone the project into their local WSL/Linux environment. **The user does not need the ability to open the electron application.**
- run `npm install && npm run package-linux`
- The process will take a while, but the output will consist of the installer for the Linux environment, along with `latest-linux.yml` required for the auto-updater. The output can usually be found in the `release` folder in the repository directory. Read the terminal carefully to determine the directory path if that is not the case.

All releases should be done in GitHub. There are many resources on how to create a release in GitHub. The following files should be included as assets:

- Windows installation: `Swell-Setup-<version>.exe`, `Swell-Setup-<version>.exe.blockmap`
- MacOS installation: `Swell-<version>.dmg`, `Swell-<version>.dmg.blockmap`, `Swell-<version>-mac.zip` (somewhat optional)
- Linux installation: `Swell-<version>.AppImage`
- x86-64: `Swell_<version>_amd64.deb`
- YAML files for auto-updater: `latest-linux.yml`, `latest-mac.yml`, `latest.yml`
- Source code in `zip` and `tar.gz` formats

See [Swell's release page](https://github.com/open-source-labs/Swell/releases) for examples.

---
## How can I update [Swell's website](https://getswell.io/) after the iteration?

The website is hosted on AWS, which means you will need credentials to access the files (in S3 buckets) for the latest version of the website. You will need to contact OS Labs for the credentials, or if you are iterating the product as part of a Codesmith program they should have access to the information needed.

Things to consider updating:

- Ensure the download links are pointing to the latest version
- Any videos/screenshots that have been updated
- Any new feature(s) you want to showcase
- Add your names, headshots, and relevant information in the `contributors` section

---

## Maintaining this document

This should serve as an entry point for any developers who wish to iterate on Swell and therefore, should be kept as up-to-date as possible. **At the end of your iteration, you are strongly encouraged to update this document for future developers.**

Thank you for your consideration and let's work on making Swell one of the best open-source products to contribute!

