const app = require('../testApp.js');

class ReqRes {
	get sendBtn() {
		return app.client.$('button=Send')
	}

	get removeBtn() {
		return app.client.$('button=Remove')
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
}

module.exports = new ReqRes(); 