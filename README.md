# Swell 
[![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=Swell%20for%20your%20streaming%20api%20testing%20needs&url=https://www.getswell.io&hashtags=SSE,WebSocket,HTTP,API,developers)


Swell is a Streaming API development tool that enables developers to test API endpoints served over modern networking technologies including Server-Sent Events (SSE), WebSocket, and HTTP2.

## Getting Started

Visit www.getswell.io for a download link. 

Swell is currently only supported on OS X with future support planned for Linux and Windows.

### Features
Swell is a one-stop shop for sending and monitoring your API requests

<img src="https://i.imgur.com/tcfbCPf.jpg"
     style="float: left; margin-right: 10px;margin-bottom : 40px; margin-top : 10px; border: 1px solid grey;" />

* Send and monitor up to six concurrent connections
* Interactive chart delivers request/response timing information in an easy to digest form
* Native OS/X app

### Supported Technologies
* *HTTP2*: Swell supports full HTTP2 multiplexing of requests and responses. HTTP requests to the same host will be sent over the same connection. Swell will attempt to initiate an HTTP2 connection for all HTTPS requests by default, but will revert to HTTP1.1 for legacy servers.
<img src="https://i.imgur.com/jxY2Y2y.png"
     style="float: left; margin-right: 10px; margin-bottom : 30px; margin-top : 10px; border: 1px solid black;" />

* *Server-Sent Events (SSE)*: Swell displays SSE events one by one as they come in.
<img src="https://i.imgur.com/SrzGDxM.png"
     style="float: left; margin-right: 10px; margin-bottom : 30px; margin-top : 10px; border: 1px solid grey;" />


* *WebSocket (WS)*: Swell enables connecting directly to WebSocket servers with an HTTP handshake. Developers can directly send messages to the connected WS server. Messages are displayed in chatbox format, clearly indicating outgoing and incoming messages.
<img src="https://i.imgur.com/cyVs9MZ.png"
     style="float: left; margin-right: 10px;margin-bottom : 30px; margin-top : 10px; border: 1px solid grey;" />


## Built With
* Electron
* React
* Redux
* Chart.js


## Authors

* **Anthony Terruso** - [discrete projects](https://github.com/discrete-projects)
* **Brandon Marrero** - [brandon6190](https://github.com/brandon6190)
* **Jason Ou** - [jasonou1994](https://github.com/jasonou1994)
* **Kyle Combs** - [texpatnyc](https://github.com/texpatnyc)

## License

This project is licensed under the MIT License.


