# Contributing to Swell in the context of a group/medium-term project

If you are considering contributing to Swell in the context of a group or medium-term project, you are at the right place! Here is a document that will give you more information regarding the state of the product and some considerations for future iteration.

---

## As a developer, what experience can you get out of contributing to Swell?

- Basics of full-stack software development:
  - TypeScript + JavaScript
  - React
  - Redux
  - Node
  - SASS
  - Express
  - Webpack
  - Client-side storage (IndexedDB)
  - Testing
    - Unit testing with Jest
    - End-to-end (E2E) testing with Playwright and Mocha
- Advanced and/or specialized knowledge on:
  - Electron
  - APIs: HTTP/2, GraphQL
  - API served over streaming technologies:
    - Server-Sent Events (SSE)
    - WebSockets
    - gRPC
    - tRPC
    - WebRTC
    - OpenAPI

---

## How to download and test the application locally?

1. Fork and/or clone the repository into your local machine
2. In your terminal:
   - `npm install`, then
   - `npm run dev`
3. Wait for the electron application to start up (it may take a bit)

There is E2E testing available via `npm run test`. Note that not all tests in the E2E test suite work currently. Please refer to `./test/testSuite.js` for more details.

---

## What is the current state of the application?

From a functionality standpoint:

- Consistent UI/UX styling and color palette
- Make requests via HTTP/2
- Query, Mutation, Subscribe/unsubscribe to GraphQL endpoints
- HTTP/2 stress testing with `GET` requests
- GraphQL stress testing with `Query`
- Mock server for HTTP/2 (`Express`) and GraphQL (`Apollo server`)
- Ability to store historical requests

From a codebase standpoint:

- Partial conversion to TypeScript
- Conversion to Redux toolkit _almost_ complete
- Some working E2E testing (more details in `./test/testSuite.js`)

---

## What is the way to render electron app during development for WSL users?

- WSL and Electron doesn't work well together where the application won't load when using npm run dev.
- One solution suggestion is to download the repo directly on your windows machine and not use WSL.
    - You can right-click on the bottom-left of your VSCode and uncheck remote host so that you still get the command-line functionalities.
- Another solution is to use Xserver (graphical interface for linux) to render things from Linux onto your Windows.
    - This article was really helpful in getting things to work (https://www.beekeeperstudio.io/blog/building-electron-windows-ubuntu-wsl2)
    - The two difference that diverges from the articles instructions is on WSL Config step with .bashrc file and VcsXsrv config step 3
        - Here is the article to refer to (https://skeptric.com/wsl2-xserver/)
        - .bashrc File: 
            - You should add this following script instead of what they put:
                - export DISPLAY=$(/sbin/ip route | awk '/default/ { print $3 }'):0
        - VcsXsrv:
            - Check Disable access control as well.
    - After these steps, you will have to enable WSL to access X SErver on Windows Firewall(refer to the skeptric article)
    - If x11 calc is able to pop-up, it means everything is working well.
- There is a long load time when running the server, it may take a few minutes.

## What are some of the features that require future iterations?

### Continue reducing the size and complexity of the codebase

This codebase has an interesting combination of over-modularization and code de-centralization/duplication occurring at the same time. For example - each type of API endpoint composer window (top right section of the app) is its own module/file, but a lot of the code inside is duplicated (see `Http2Composer.tsx` and `GraphQLComposer.tsx`).

The impacts to the product are:

- The codebase can be incredibly difficult to navigate if you are not familiar with the structure
- The app is slow to load in all environments (production, development, test)

**Some of us have found [ReacTree](https://reactree.dev/) VS Code extension incredibly helpful in visualizing the UI components. Utilizing the extension could be your entry into understanding the structure of the codebase.**

As you iterate the product, keep in mind the footprint your new feature could add to the codebase. Could you re-use some of the existing modules? Can you even refactor and/or remove the obsolete code to help maintain the health of the codebase?

### Ensure consistent redux state management

The redux state initiation and management for various API endpoints in this codebase is inconsistent. If you cross reference the state initialization, transition/update and clean up in various modules with `types.ts`, you will notice many TypeScript typing error due to inconsistent state management. This will need to be cleaned up bit by bit to ensure a state that works across all types of APIs in this application.

### Basic functionality for more advanced APIs not working as expected

For the following technologies - if you reference the gifs in `readme` and try to replicate the steps in the application you may not get the same result:

- gRPC
- tRPC
- WebSocket
- OpenAPI

If future groups have a desire to iteration on the above features, please ensure the basic functionality works as expected, update E2E testing in `./test/testSuite.js` before adding new features.

### Continue improving UI/UX consistency in the app

The UX/UI styling and functionality is not consistent across different API endpoints. For example, there is a `Send Request` button for HTTP/2, but not for GraphQL.

Moreover, the application lacks instructions on how to utilize some of the more advanced features like WebSocket and tRPC. Some tooltips on explaining how the feature works would be tremendously helpful.

Lastly, when making the app smaller on windows desktop or using a computer with smaller screen size, some of the buttons are partially cut out. It would be great to establish a minimum size for each section and/or input field so the application can auto-resize elegantly.

### Continue conversion to TypeScript, Material UI and Redux toolkit

Conversion to Material UI allows a more consistent component style and promotes semantic HTML language throughout the application. TypeScript provides strong typing to improve code quality, maintainability and reduce runtime errors. Redux toolkit reduces the amount of boilerplate requires to use Redux within the application and provide a centralized environment for state initialization and management.

### WebRTC STUN/TURN server input is read-only

The `RTCConfiguration` format required for WebRTC STUN/TURN server is an object with `iceServers` as the key and an array of objects as the value. With the current input format on the application, it is very difficult and error-prone to attempt to format the user input correctly. Based on research it seems like many other alternatives that test STUN/TURN servers separate each key/value into its input text box (similar to how key/value pairs for headers are done for HTTP/2 in Swell). Our assumption is that this way the application can have better control formatting `RTCConfiguration`. If anyone is considering advancing the current WebRTC functionalities in the future, this should be a priority so we can fully enable the ability to test any STUN/TURN servers using Swell.

### Broken Travis CI build

In the `README` document, you will notice that the link to the `Build Status` to Travis CI is not functional. A functional CI/CD pipeline is critical to the health of any software product, so it would be great if we can rebuild CI/CD using alternative service like GitHub Actions.

---

## Maintaining this document

This should serve as an entry point for any developers who wish to iterate on Swell and therfore, should be kept as up-to-date as possible. **At the end of your iteration, you are strongly encouraged to update this document for future developers.**

Thank you for your consideration and let's work on making Swell one of the best open-source products to contribute!

