<p align="center"><img src="./src/assets/img/horizontal-logo-lockup.png" style="margin-top: 10px; margin-bottom: -10px;"></p>

#

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/open-source-labs/Swell/blob/master/LICENSE.txt)
[![Build Status](https://travis-ci.org/open-source-labs/Swell.svg?branch=master)](https://travis-ci.org/open-source-labs/Swell)
![GitHub package.json version](https://img.shields.io/github/package-json/v/open-source-labs/Swell?color=blue)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/getswell/getswell/issues)
[![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=Swell-%20For%20all%20your%20streaming%20API%20testing%20needs&url=https://www.getswell.io&hashtags=SSE,WebSocket,HTTP,API,developers)

Swell is a API development tool that enables developers to test endpoints served over streaming technologies including Server-Sent Events (SSE), WebSockets, HTTP2, GraphQL and gRPC.

## Getting Started

Visit www.getswell.io to download the latest release.

Swell is currently available for OS X, Linux and Windows.

## Highlights

Swell is a one-stop shop for sending and monitoring your API requests

- Send and monitor streams over HTTP2 / HTTP1 (including SSEs) and WebSockets
- Create GraphQL queries, introspections, mutations, and subscriptions
- Make API requests based on a range of provided options that conform to the specifications defined in an OpenAPI document.
- Verify STUN and TURN server connectivity for WebRTC applications by generating an SDP
- Provides full streaming testing support for gRPC
- View response timing information and history in an interactive chart for each request
- Save workspaces of multiple requests for later access
- Import and export workspaces for sharing
- Compose test suites in JavaScript with Chai-style TDD/BDD assertion syntax
- Execute a collection of requests in succession and receive clear visual feedback of each test's status
- Schedule requests on to be sent on a regular time interval to support endpoint functional validation tests

## Supported Technologies

- _HTTP2_: Swell supports full HTTP2 multiplexing of requests and responses. HTTP requests to the same host will be sent over the same connection. Swell will attempt to initiate an HTTP2 connection for all HTTPS requests by default, but will revert to HTTP1.1 for legacy servers. Multiple concurrent streams are allowed for each connection.
  <kbd><img src="./ReadMeGifs/Gifs/ConcurrentStreams.gif" style="float: left; margin-right: 10px; margin-bottom : 30px; margin-top : 10px; border: 1px solid black;" /></kbd>

- _Server-Sent Events (SSE)_: Initiated by a simple toggle box, Swell displays SSE events one by one as they come in. Similar to HTTP2 streams, multiple open connection streams are allowed for SSE.
  <kbd><img src="./ReadMeGifs/Gifs/SSE.gif" style="float: left; margin-right: 10px; margin-bottom : 30px; margin-top : 10px;" /></kbd>

- _WebSocket (WS)_: Swell enables connecting directly to WebSocket servers with an HTTP handshake. Developers can directly send messages to the connected WS server. Messages are displayed in chatbox format, clearly indicating outgoing and incoming messages.
  <kbd><img src="./ReadMeGifs/Gifs/WS.gif" style="float: left; margin-right: 10px;margin-bottom : 30px; margin-top : 10px;" /></kbd>

- _GraphQL_: Swell includes full support for all three root types of GraphQL - queries, mutations, and subscriptions as well as Introspection - with and without variables. Smart code editor allows for easy query creation.
  <kbd><img src="./ReadMeGifs/Gifs/GraphQL.gif" style="float: left; margin-right: 10px;margin-bottom : 30px; margin-top : 10px;" /></kbd>

- _gRPC_: Swell includes full support for all four streaming types of gRPC - unary, client stream, server stream, bidirectional stream.
  <kbd><img src="./ReadMeGifs/Gifs/GRPCResponses.gif" style="float: left; margin-right: 10px;margin-bottom : 30px; margin-top : 10px;" /></kbd>
  
- _OpenAPI_: Swell supports the enumeration and execution of REST and RPC API requests as defined in a user-provided OpenAPI document.
  <kbd><img src="./ReadMeGifs/Gifs/openapi.gif" style="float: left; margin-right: 10px;margin-bottom : 30px; margin-top : 10px;" /></kbd>
  
- _WebRTC_: Swell enables testing STUN and TURN ICE server connectivity for WebRTC applications.  
  <kbd><img src="./ReadMeGifs/Gifs/webrtc.gif" style="float: left; margin-right: 10px;margin-bottom : 30px; margin-top : 10px;" /></kbd>
  
    Developers enter ICE server details as an array of JavaScript objects (example code block below).  An RTCPeerConnection is instantiated and an SDP is generated.

    ```javascript
    [
      {
        urls: 'turn:111.222.333.444:54321',
        username: 'myAwesomeUsername',
        credential: 'mySecretPassword',  // or token
        credentialType: 'password'
      },
      {
        urls: 'stun:555.777.888.999:43210',
      },
    ]
    ```

- _Webhooks_: Swell includes user-defined HTTP callback connection testing designed to test other server's connection to the web and ability to send data. The test insures that when an event occurs, the source site makes an HTTP request to the URL configured for the webhook. 
  <kbd><img src="./ReadMeGifs/Gifs/Webhook.gif" style="float: left; margin-right: 10px;margin-bottom : 30px; margin-top : 10px;" /></kbd>

## Additional Features

- _Scripting in Swell_: Swell allows you to write assertion tests to aid in the test-driven development cycle of backend API services.
  <kbd><img src="./ReadMeGifs/Gifs/SimpleResponseTest.gif"
       style="float: left; margin-right: 10px; margin-bottom : 30px; margin-top : 10px; border: 1px solid black;" /></kbd>
- _Workspaces_: Swell allows you to save workspaces for easier testing of multiple requests.
- _Import/Export Workspaces_: Swell allows you to import and export workspaces, making it easy to share collections with your team.
- _Preview_: You can now view a rendered preview of certain API responses (HTML)
  <kbd><img src="./ReadMeGifs/Gifs/AdditionalFeatures.gif"
       style="float: left; margin-right: 10px; margin-bottom : 30px; margin-top : 10px; border: 1px solid black;" /></kbd>
- _Collection Runner_: You can also stage requests in the workspace and automate the process of sending off each one. No need to manually press send on each one, instead each request will fire off in the order of staging.
  <kbd><img src="./ReadMeGifs/Gifs/CollectionTest.gif"
       style="float: left; margin-right: 10px; margin-bottom : 30px; margin-top : 10px; border: 1px solid black;" /></kbd>
- _Schedule Tests_: You can also automate sending requests to occur on a periodic basis.
  <kbd><img src="./ReadMeGifs/Gifs/ScheduleTest.gif"
       style="float: left; margin-right: 10px; margin-bottom : 30px; margin-top : 10px; border: 1px solid black;" /></kbd>
- _Dark Mode_: Swell allows you to toggle between light and dark mode when viewing the application.  
  <kbd><img src="./ReadMeGifs/Gifs/DarkMode.gif"
       style="float: left; margin-right: 10px; margin-bottom : 30px; margin-top : 10px; border: 1px solid black;" /></kbd>

## Built With

- Electron
- React
- Redux
- Apollo Client
- Websockets
- gRPC-js
- VM2
- Chart.js
- Bulma
- IndexedDB
- Chai
- Mocha

## Authors

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

## License

This project is licensed under the MIT License
