const chai = require('chai');
const chaiHttp = require('chai-http');
const sideBar = require('../pageObjects/Sidebar.js');
const reqRes = require('../pageObjects/ReqRes.js');

chai.use(chaiHttp);
const expect = chai.expect;

module.exports = () => {
	describe('gRPC requests', () => {
		// beforeEach(async () => {
		// 	await reqRes.removeBtn.click()
		// 	}
		// )

		const sideBarSetup = async () => {
			await sideBar.gRPC.click();
			await sideBar.url.addValue('0.0.0.0:50051');
			await sideBar.grpcBody.setValue(`syntax= "proto3";service HelloWorldService {rpc GreetMe (GreetRequest) returns (GreetReply){}}message GreetRequest {string name = 1;}message GreetReply {string reply = 1;}`)
			await sideBar.saveChanges.click();
			await new Promise((resolve) => setTimeout( async () => {
				await sideBar.selectService.click();
				await sideBar.greeter.click();
				resolve()
			}, 2000))
		}

		it('it should work on a unary request', async () => {
			await sideBarSetup();
			await sideBar.selectRequest.selectByIndex(0);
			// await sideBar.sayHello.click();
			await sideBar.addRequestBtn.click();
		})
	})
}