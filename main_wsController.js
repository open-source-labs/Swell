const { ipcMain } = require("electron");
// const store = require('./src/client/store.js')
const WebSocketClient = require('websocket').client

const wsController = {
	wsConnect: null,
  openWSconnection(event, reqResObj, connectionArray) {
		console.log('inside openWSconnection main');

		//set reqResObj for WS
		reqResObj.response.messages = [];
		reqResObj.request.messages = [];
		reqResObj.connection = 'pending';
		reqResObj.closeCode = 0;
		reqResObj.timeSent = Date.now();
		// store.default.dispatch(actions.reqResUpdate(reqResObj));

		//update frontend its pending
		event.sender.send("reqResUpdate", reqResObj);

		console.log('reqResObj',reqResObj)
		//if connection doesn't exist, create a new one
		let socket;
		console.log('enter', connectionArray.filter(obj => obj.id === reqResObj.url).length)
		try {
			// let socket1 = new WebSocket(reqResObj.url);
			// console.log('socket1', socket1)
			console.log('inside try')
			console.log('url', reqResObj.url)
			socket = new WebSocketClient()
			console.log('socket', socket)
		}
		catch (err) {
			console.log('socket', socket)
			console.log('inside catch')
			reqResObj.connection = 'error';
			// store.default.dispatch(actions.reqResUpdate(reqResObj));
			event.sender.send("reqResUpdate", reqResObj);
			return;
		}
		// let connect;
		//when it connects, update connectionArray
		socket.on('connect', (connection) => {
			this.wsConnect = connection;
			console.log('inside open event')
			// connection.close();
			console.log('after close')
			reqResObj.connection = 'open';
			console.log('connection', connection)
			const openConnectionObj = {
				connection,
				protocol: 'WS',
				id: reqResObj.id,
			};
			// console.log('before openconnection push')
			console.log('connectionArray', connectionArray)
			connectionArray.push(openConnectionObj);
			console.log('connectionArray after', connectionArray)
			event.sender.send("update-connectionArray", connectionArray);
			// connect = connection;
			// reqResObj.socket = socket;
			// store.default.dispatch(actions.reqResUpdate(reqResObj));
			event.sender.send("reqResUpdate", reqResObj);
			this.wsConnect.on('close', () => {
        console.log('closed WS');
		});
			//listen for close event from client
			
			//listen for messages sent from client
			
		});
		socket.connect(reqResObj.url);


		//when there is an incoming message, update the reqResObj
		//added error event listener 
		// socket.on('error', function (event) {
		//   console.log('WebSocket error: ', event);
		// });

		//when the socket closes set close event on reqResObj and update store
		// socket.on('close', (event) => {
		//   console.log('inside close event')
			
		//   // get fresh copy of reqRes
		//   reqResObj = store.default
		//     .getState()
		//     .business.reqResArray.find(obj => obj.id === reqResObj.id);

		//   //  attach close code to reqResObj
		//   reqResObj.closeCode = event.code;

		//   switch (event.code) {
		//     case 1006: {
		//       reqResObj.connection = 'error';
		//       break;
		//     }
		//     default: {
		//       reqResObj.connection = 'closed';
		//       break;
		//     }
		//   }

			// store.default.dispatch(actions.reqResUpdate(reqResObj));
			// event.sender.send("reqResUpdate", reqResObj);

		// });

	// 	ipcMain.handle("send-ws", (event, reqResObj, inputMessage) => {
	// 		console.log('in sendWSMessage')
	// 		console.log('reqResObj.id', reqResObj.id);
	// 		console.log('request messages', reqResObj.request.messages)
	// 		// const state = store.getState();
	// 		// console.log('reqResObj',reqResObj)
	// 		// const matchedConnection = connectionController.getConnectionObject(reqResId);
	// 		connection.send(inputMessage);

	// // get fresh copy of reqRes
	// // const reqResObj = store.default.getState().business.reqResArray
	// //   .find(obj => obj.id === reqResId);

	// 		// console.log('reqRes before', reqResObj); 
	// // adds to reqResObj in state to  
	// 		reqResObj.request.messages.push({
	// 			data: inputMessage,
	// 			timeReceived: Date.now(),
	// 		});
	// 		console.log('reqRes after sending', reqResObj.request.messages);

	// 		event.sender.send("reqResUpdate", reqResObj);
	// 		connection.on('message', (e) => {
	// 			console.log('inside message event')
	// 			console.log('e', e);
	
	// 			// get fresh copy of reqRes
	// 			// reqResObj = store.default
	// 			//   .getState()
	// 			//   .business.reqResArray.find(obj => obj.id === reqResObj.id);
	
	// 			reqResObj.response.messages.push({
	// 				data: e.utf8Data,
	// 				timeReceived: Date.now(),
	// 			});
	
	// 			// store.default.dispatch(actions.reqResUpdate(reqResObj));
	// 			event.sender.send("reqResUpdate", reqResObj);
	// 		});
	// 	})
	},

	closeWs(event) {
		console.log('closing connection')
		this.wsConnect.close();
		// reqResObj.connection = 'closed';
		// event.sender.send("reqResUpdate", reqResObj);
	},

	sendWebSocketMessage(event, reqResObj, inputMessage) {
		// ipcMain.handle("send-ws", (event, reqResObj, inputMessage) => {
			console.log('in sendWSMessage')
			console.log('reqResObj.id', reqResObj.id);
			console.log('request messages', reqResObj.request.messages)
			// const state = store.getState();
			// console.log('reqResObj',reqResObj)
			// const matchedConnection = connectionController.getConnectionObject(reqResId);
			this.wsConnect.send(inputMessage);

	// get fresh copy of reqRes
	// const reqResObj = store.default.getState().business.reqResArray
	//   .find(obj => obj.id === reqResId);

			// console.log('reqRes before', reqResObj); 
	// adds to reqResObj in state to  
			reqResObj.request.messages.push({
				data: inputMessage,
				timeReceived: Date.now(),
			});
			console.log('reqRes after sending', reqResObj.request.messages);

			event.sender.send("reqResUpdate", reqResObj);
			this.wsConnect.on('message', (e) => {
				console.log('inside message event')
				console.log('e', e);
	
				// get fresh copy of reqRes
				// reqResObj = store.default
				//   .getState()
				//   .business.reqResArray.find(obj => obj.id === reqResObj.id);
	
				reqResObj.response.messages.push({
					data: e.utf8Data,
					timeReceived: Date.now(),
				});
	
				// store.default.dispatch(actions.reqResUpdate(reqResObj));
				event.sender.send("reqResUpdate", reqResObj);
			});
		// })


	  // console.log('in sendWSMessage')
	  // console.log('reqResObj',reqResObj)
	  // // const matchedConnection = connectionController.getConnectionObject(reqResId);
	  // reqResObj.socket.message(message);

	  // // get fresh copy of reqRes
	  // // const reqResObj = store.default.getState().business.reqResArray
	  // //   .find(obj => obj.id === reqResId);

	  // console.log('reqRes before', reqResObj); 
	  // //adds to reqResObj in state to  
	  // reqResObj.request.messages.push({
	  //   data: message,
	  //   timeReceived: Date.now(),
	  // });
	  // console.log('reqRes after', reqResObj);
	  // event.sender.send("reqResUpdate", reqResObj);

	},
};
module.exports = () => {
    // creating our event listeners for IPC events
    ipcMain.on("open-ws", (event, reqResObj, connectionArray) => {
      // we pass the event object into these controller functions so that we can invoke event.sender.send when we need to make response to renderer process
      wsController.openWSconnection(event, reqResObj, connectionArray);
    });
    ipcMain.on("send-ws", (event, reqResObj, inputMessage) => {
      // we pass the event object into these controller functions so that we can invoke event.sender.send when we need to make response to renderer process
      wsController.sendWebSocketMessage(event, reqResObj, inputMessage);
		});
		ipcMain.on("close-ws", (event) => {
			wsController.closeWs(event);
		})
  };