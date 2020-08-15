const chai = require('chai');
const chaiHttp = require('chai-http');
const sideBar = require('../pageObjects/Sidebar.js'); 
const reqRes = require('../pageObjects/ReqRes.js');

chai.use(chaiHttp);
const expect = chai.expect;

module.exports = () => {
	describe('Websocket requests', () => {
		it('it should send and receive messages', async () => {
			// await reqRes.removeBtn.click()
			await sideBar.websocket.click();
			await sideBar.url.clearElement();
			await sideBar.url.addValue('wss://echo.websocket.org'); 
			await sideBar.addRequestBtn.click();
			await reqRes.sendBtn.click();
			await new Promise((resolve) => setTimeout( async () => {
				await reqRes.messageTextArea.addValue('testing websocket protocol');
				await reqRes.messageBtn.click();
				const messageClient = await reqRes.messageClient.getText();
				await new Promise((resolve) => setTimeout( async () => {
					const messageServer = await reqRes.messageServer.getText();
					expect(messageClient).to.equal('testing websocket protocol')
					expect(messageServer).to.equal(messageClient)
					resolve()
				}, 1000))
				resolve()
			}, 1000))
		})
	})
}