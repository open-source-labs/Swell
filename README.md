<img src="./src/assets/img/horizontal-logo-lockup.png" style="display: block; margin: 10px auto 30px;">

# Swell

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/open-source-labs/Swell/blob/master/LICENSE.txt)
![GitHub package.json version](https://img.shields.io/github/package-json/v/open-source-labs/Swell?color=blue)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/getswell/getswell/issues)
[![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=Swell-%20For%20all%20your%20streaming%20API%20testing%20needs&url=https://www.getswell.io&hashtags=SSE,WebSocket,HTTP,API,developers)

Swell is an API development tool that enables developers to test HTTP2, GraphQL endpoints, as well as ones served over streaming technologies including Server-Sent Events (SSE), WebSockets, gRPC, WebRTC, and OpenAPI.

## Getting Started

Visit www.getswell.io to download the latest release.

Swell is available for OSX, Linux, and Windows.

## Highlights

Swell is a one-stop shop for sending and monitoring your API requests:

- Send and monitor streams over HTTP/2 (including SSEs) and WebSockets
- Create GraphQL queries, introspections, mutations, and subscriptions
- Test WebRTC applications over video, audio and text channels
- Stress testing HTTP/2 and GraphQL endpoints
- Create your own HTTP/2 mock server
- Store workspaces of multiple requests for later use
- Import and export workspaces locally
- Compose test suites in JavaScript with Chai-style TDD/BDD assertion syntax

## Considering iterating Swell in the future?

We highly encourage you to check out the `DEV-README.md` in the `docs` folder. We've included a comprehensive guide on the latest updates, which areas would benefit from future iterations, as well as details of core components.

## Core features

- _HTTP2_: Swell supports full HTTP2 multiplexing of requests and responses. HTTP requests to the same host will be sent over the same connection. Swell will attempt to initiate an HTTP2 connection for all HTTPS requests by default, with the ability to revert to HTTP1.1 for legacy servers. Multiple concurrent streams are allowed for each connection.
  <img src="./ReadMeGifs/Gifs/HttpTesting.gif" style="display: block;  margin: 10px auto 30px; border: 1px solid black;" />

- _GraphQL_: Swell includes full support for all three root types of GraphQL - queries, mutations, and subscriptions – as well as Introspection. Variables are also supported, making creating queries easy.
  <img src="./ReadMeGifs/Gifs/GraphQL.gif" style="display: block; margin: 10px auto 30px;" />

- _Server-Sent Events (SSE)_: Initiated by a simple toggle box, Swell displays SSE events one by one as they come in. Similar to HTTP2 streams, multiple open connection streams are allowed for SSE.
  <img src="./ReadMeGifs/Gifs/ServerSideEvents.gif" style="display: block; margin: 10px auto 30px;" />

- _WebSockets (WS)_: Swell enables connecting directly to WebSocket servers with an HTTP handshake, with developers able to send messages to the connected WS server directly. All outgoing and incoming messages are displayed in real time.
  <img src="./ReadMeGifs/Gifs/Websockets.gif" style="display: block; margin: 10px auto 30px;" />

- _gRPC_: Swell includes full support for all four streaming types of gRPC - unary, client stream, server stream, bidirectional stream.
  <!-- -TODO --- This needs to be updated -->
    <img src="./ReadMeGifs/Gifs/gRPC.gif" style="display: block;  margin: 10px auto 30px;" />

- _tRPC_: Swell includes full support for all methods of TypeScript Remote Procedure Calls including batch call support for queries and mutations as well as subscription
  <img src="./ReadMeGifs/Gifs/trpc.gif" style="display: block; margin: 10px auto 30px;" />
  <!-- <img src="./ReadMeGifs/Gifs/tRPC-subscription.gif" style="display: block; margin: 10px auto 30px;" /> -->

  Calls are currently being made using by using http get and post request using TRPC's http RPC specification (See [RPC docs](https://trpc.io/docs/rpc)). TLDR- inputs for query procedures will be turn into uri-encoded json string and send as query param while inputs for mutate procedures will be store inside of the body.

  Batch requests can be made by adding multiple procedures before sending out the request, all query procedures will get batch together into one singular get request and all mutate procedures will get batch together into one singular put request, if there are mixture of query and mutate procedures call in one request, the app will send out both a post and get request concurrently and combine the response into one response.

  Nested endpoint must follow the general format parentEndpoint.childEndpoint.grandchildEndpoint. For example:

  ```js
  client.user.update.mutate({ userId: '1', name: 'Luke' });
  ```

  A request to the above endpoint must have the mutate option selected from the drop down menu, must have an endpoint of .user.update and a input body of {"userId": "1","name": "Luke"}

  See [tRPC docs](https://trpc.io/docs/) for more information on sending tRPC requests or setting up a tRPC server.


- _WebRTC_: Swell makes it easy to test WebRTC applications for video, audio and text channels. Currently Swell supports manual entry of SDPs.

  ### Walkthrough for setting up a text channel connection using the app's generated offer and answer:

  - Step 1
    Caller: Generate an offer by clicking “Get Offer.” Copy the offer to your computer's clipboard and send it to recipient (we recommend sending by email).
  - Step 2
    Recipient: Copy the offer you received from the caller and paste it into the offer box (the top text box)
  - Step 3
    Recipient: Click “Get answer” button, generate an answer and copy it to your computer's clipboard. Send it to caller (email recommended)
  - Step 4
    Caller: Copy answer to your computer's clipboard and paste it into the answer box (bottom text box).
  - Step 5
    Caller: Click the “add answer” button. Now the connection is open!
  - Step 6
    Caller: Click “add to workspace” button.
  - Step 7
    Recipient: Click “add to workspace” button.
  - Step 8
    Caller: Click "Send" button on the left-hand side of the app.
  - Step 9
    Recipient: Click "Send" button on the left-hand side of the app.
  - Step 10
    Send and receive text messages via the response panel at the bottom of the app.
  <img src="./ReadMeGifs/Gifs/webrtc.gif" style="display: block; margin: 10px auto 30px; " />


## Additional features

- _Stress testing for HTTP/2 and GraphQL_: Test your server backend with Swell's stress testing feature to ensure your server can manage expected and unexpected loads accordingly
  <img src="./ReadMeGifs/Gifs/HttpStressTest.gif"
       style="display: block; margin: 10px auto 30px; border: 1px solid black;" />
  <img src="./ReadMeGifs/Gifs/GraphQLTest.gif"
       style="display: block; margin: 10px auto 30px; border: 1px solid black;" />

- _Send Requests Directly to an Endpoint_: You are able to immediately send a request to an endpoint OR stage a request in your workspace for multi-level testing.

- _Scripting in Swell_: If you favor test-driven development, Swell allows you to write assertion tests to aid defining and testing backend API services.
  <img src="./ReadMeGifs/Gifs/Assertion-Testing.gif"
       style="display: block; margin: 10px auto 30px; border: 1px solid black;" />

- _Workspaces_: Swell allows you to save workspaces for easier testing of multiple requests.

- _Preview_: You can now view a rendered preview of certain API responses (HTML)

- _Collection Runner_: You can also stage requests in the workspace and automate the process of sending off each one. No need to manually press send on each one; instead each request will fire off in the order of staging.

- _File Upload/Dark Mode_: If you click on the body drop down menu, you can select binary, which allows you to upload a file that can be sent along with any request to test backend file upload routes. Additionally, you can toggle dark mode via the button in the top right-hand corner.

  <img src="./ReadMeGifs/Gifs/FileUploadAndDarkMode.gif"
       style="display: block; margin: 10px auto 30px; border: 1px solid black;" />

## Experimental Features

- _Mock Server_: Swell allows you to create your own HTTP/2 mock server to facilitate front-end development without depending on a fully built backend server.
  <img src="./ReadMeGifs/Gifs/MockServer.gif" style="display: block;  margin: 10px auto 30px;" />

- _Webhooks_: Swell includes user-defined HTTP callback connection testing designed to test other server's connection to the web and ability to send data. The test insures that when an event occurs, the source site makes an HTTP request to the URL configured for the webhook.

- _OpenAPI_: Swell supports the enumeration and execution of REST and RPC API requests as defined in a user-provided OpenAPI document.
  <img src="./ReadMeGifs/Gifs/openapi.gif" style="display: block; margin: 10px auto 30px;" />

## Built With

- Electron
- React
- React Router
- Material UI
- Redux Toolkit
- Apollo Client
- Websockets
- gRPC-js
- tRPC
- VM2
- Chart.js
- Bulma
- IndexedDB
- Chai
- Mocha
- Playwright

## Authors

- **Isaac Mbambo** - [IM236](https://github.com/IM236)
- **Kiki Hunt** - [Iloveeverything](https://github.com/Iloveeverything)
- **Ting Lee** - [tingEng](https://github.com/tingEng)
- **Rachel Dean** - [rchldn](https://github.com/rchldn)
- **Kadeem Reid** - [Kadeem929](https://github.com/Kadeem929)
- **Karol Krzywon** - [kkrzywon](https://github.com/kkrzywon)
- **Howard Sun** - [howardCodeGit](https://github.com/howardCodeGit)
- **Carter Sarkela** - [CarterSarkela](https://github.com/CarterSarkela)
- **Adeeb Bayat** - [adeebbayat](https://github.com/adeebbayat)
- **Michael Underbrink** - [MUnderbrink90](https://github.com/MUnderbrink90)
- **Aaron Cruz** - [AArCruz](https://github.com/AArCruz)
- **Katya Villano** - [k-villano](https://github.com/k-villano)
- **Brooke Sauro** - [bhsauro](https://github.com/bhsauro)
- **Jeff Levin** - [levinjn01](https://github.com/levinjn01)
- **Alec Derritt** - [Blast61](https://github.com/Blast61)
- **Kevin Li** - [myttins](https://github.com/myttins)
- **Tommy Huynh** - [tthcodes](https://github.com/tthcodes)
- **Nitesh Manem** - [NManem](https://github.com/NManem)
- **Chad DeGange** - [cdegange](https://github.com/cdegange)
- **Timmy Zhu** - [timzhu15](https://github.com/timzhu15)
- **Christina Walton** - [CElizOwens](https://github.com/CElizOwens)
- **Akeem Smith** - [AkeemESmith](https://github.com/AkeemESmith)
- **William Murphy** - [olsoninoslo](https://github.com/olsoninoslo)
- **Chris Suzukida** - [csuzukida](https://github.com/csuzukida)
- **Fred Kim** - [Fredkim21](https://https://github.com/Fredkim21)
- **Jason Huang** - [jjhuang3](https://https://github.com/jjhuang3)
- **Nattie Chan** - [nattiechan](https://https://github.com/nattiechan)
- **Jack Sonoda** - [jackksono](https://github.com/jackksono)
- **Jaden Nguyen** - [jaden-nguyen](https://github.com/jaden-nguyen)
- **Taner Malmedal** - [tannermalmedal](https://github.com/tannermalmedal)
- **Mihran Baytaryan** - [mihran-baytaryan](https://github.com/mihran-baytaryan)
- **David Beame** - [KingzandBean](https://github.com/KingzandBean)
- **Grace Kim** - [gracekiim](https://github.com/gracekiim)
- **Alex Sanhueza** - [alexsanhueza](https://github.com/alexsanhueza)
- **Wyatt Bell** - [wcbell51](https://github.com/wcbell51)
- **John Madrigal** - [johnmadrigal](https://github.com/johnmadrigal)
- **Michael Miller** - [mjmiguel](https://github.com/mjmiguel)
- **Hideaki Aomori** - [h15200](https://github.com/h15200)
- **Matt Gin** - [chinsonhoag](https://github.com/chunsonhoag)
- **Nick Healy** - [nickhealy](http://github.com/nickhealy)
- **Grace Spletzer** - [gspletzer](https://github.com/gspletzer)
- **Stephanie Wood** - [stephwood](https://github.com/stephwood)
- **Anthony Terruso** - [discrete projects](https://github.com/discrete-projects)
- **Brandon Marrero** - [brandon6190](https://github.com/brandon6190)
- **Jason Ou** - [jasonou1994](https://github.com/jasonou1994)
- **Kyle Combs** - [texpatnyc](https://github.com/texpatnyc)
- **Kwadwo Asamoah** - [addoasa](https://github.com/addoasa)
- **Abby Chao** - [abbychao](https://github.com/abbychao)
- **Amanda Flink** - [aflinky](https://github.com/aflinky)
- **Kajol Thapa** - [kajolthapa](https://github.com/kajolthapa)
- **Billy Tran** - [btctrl](https://github.com/btctrl)
- **Paul Rhee** - [prheee](https://github.com/prheee)
- **Sam Parsons** - [sam-parsons](https://github.com/sam-parsons)
- **Nancy Dao** - [nancyddao](https://github.com/nancyddao)
- **Evan Grobar** - [egrobar](https://github.com/egrobar)
- **Dan Stein** - [danst3in](https://github.com/danst3in)
- **Amruth Uppaluri** - [amuuth](https://github.com/amuuth)
- **Yoon Choi** - [cyoonique](https://github.com/cyoonique)
- **Nathaniel Adams** - [nathanielBadams](https://github.com/nathanielBadams)
- **Robin Yoong** - [robinyoong](https://github.com/robinyoong)
- **Gary Slootskiy** - [garyslootskiy](https://github.com/garyslootskiy)
- **Sam Haar** - [samhaar](https://github.com/samhaar)
- **Edward Cho** - [edwardcho1231](https://github.com/edwardcho1231)
- **Miguel Gonzalez** - [MigGonzalez](https://github.com/MigGonzalez)
- **Jason Liggayu** - [jasonligg](https://github.com/jasonligg)
- **Warren Tait** - [whtait](https://github.com/whtait)
- **Nathan Fleming** - [njfleming](https://github.com/njfleming)
- **Konrad Kopko** - [konradkop](https://github.com/konradkop)
- **Andrea Li** - [Andrea-gli](https://github.com/Andrea-gli)
- **Paul Ramirez** - [pauleramirez](https://github.com/pauleramirez)
- **TJ Wetmore** - [TWetmore](https://github.com/TWetmore)
- **Colin Gibson** - [cgefx](https://github.com/cgefx)
- **Ted Craig** - [tedcraig](https://github.com/tedcraig)
- **Anthony Wong** - [awong428](https://github.com/awong428)
- **John Jongsun Suh** - [MajorLift](https://github.com/MajorLift)
- **Christopher Pan** - [ChristopherJPan](https://github.com/ChristopherJPan)
- **Adrian Uesugui** - [auesugui](https://github.com/auesugui)
- **Jennifer Wu** - [jsh-wu](https://github.com/jsh-wu)
- **Jacob Viesselman** - [JacobViesselman](https://github.com/JacobViesselman)
- **Michael Prince** - [MichaelGPrince](https://github.com/MichaelGPrince)
- **Genevieve Annable** - [gigifeeds](https://github.com/gigifeeds)
- **Jay Wall** - [hanswand](https://github.com/hanswand)
- **Sam Pyo** - [samhpyo](https://github.com/samhpyo)
- **Drew Pomatti** - [thedrewery](https://github.com/thedrewery)
- **Kurtis Waterbury** - [kurto8](https://github.com/kurto8)
- **Yale Yng-Wong** - [ywy-w](https://github.com/ywy-w)
- **Evelin Goldin** - [evelingoldin](https://github.com/evelingoldin)
- **Alexander Adams** - [alex-e-adams](https://github.com/alex-e-adams)
- **Ethan Sclarsky** - [esclarsky](https://github.com/esclarsky)
- **Travis Lovis** - [tlovis](https://github.com/tlovis)
- **HyeJin Kim** - [hyejinkim](https://github.com/hyejinkim)
- **Alexa Nunes** - [A13xaNunes](https://github.com/A13xaNunes)
- **Michael Smith** - [Parkreiner](https://github.com/Parkreiner)

## License

This project is licensed under the MIT License