const app = require('../testApp.js');

class ReqRes {
	get sendBtn() {
		return app.client.$('button=Send')
	}

	get removeBtn() {
		return app.client.$('button=Remove')
	}

	get mutationRemoveBtn() {
		return app.client.$('button#MUTATION')
	}

	get jsonPrettyError() {
		return app.client.$('pre.__json-pretty-error__')
	}

	get jsonPretty() {
		return app.client.$('pre.__json-pretty__')
	}

	get statusCode() {
		return app.client.$('div.tertiary-title')
	}

	get jsonKey() {
		return app.client.$('span.__json-key__')
	}

	get jsonValue() {
		return app.client.$('span.__json-value__')
	}

	get messageTextArea() {
		return app.client.$('input.websocket_input-text')
	}

	get messageBtn() {
		return app.client.$('button.websocket_input-btn')
	}

	get messageClient() {
		return app.client.$('div#id_websocket_message-client')
	}

	get messageServer() {
		return app.client.$('div#id_websocket_message-server')
	}
}

module.exports = new ReqRes(); 