const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs')
const path = require('path')
const { request } = require('http');
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

		let body = '';

		before((done) => {
			fs.readFile(path.join(__dirname, '../hw2.proto'), 'utf8', (err, data) => {
				if (err) console.log(err);
				body = data;
				done();
			})
		})
		
		const sideBarSetup = async () => {
			await sideBar.gRPC.click();
			await sideBar.url.addValue('0.0.0.0:50051');
			await sideBar.grpcBody.addValue(body)
			await sideBar.saveChanges.click();
		}

		const requestSetup = async (index) => {
			await sideBar.selectRequest.selectByIndex(index);
			await sideBar.addRequestBtn.click();
			await reqRes.sendBtn.click();
		}
		
		it('it should work on a unary request', async () => {
			await sideBarSetup();
			await new Promise((resolve) => setTimeout( async () => {
				await sideBar.selectService.selectByIndex(1);
				await requestSetup(1)
				await new Promise((resolve) => setTimeout( async () => {
					const jsonPretty = await reqRes.jsonPretty.getText();
					expect(jsonPretty).to.include(`"message": "Hello string"`)
					resolve()
				}, 1000))
				resolve()
			}, 1000))
		})

		it('it should work on a nested unary request', async () => {
				await reqRes.removeBtn.click()
				await requestSetup(2)
				await new Promise((resolve) => setTimeout( async () => {
					const jsonPretty = await reqRes.jsonPretty.getText();
					expect(jsonPretty).to.include(`{\n    "serverMessage": [\n        {\n            "message": "Hello! string"\n        },\n        {\n            "message": "Hello! string"\n        }\n    ]\n}`)
					resolve()
				}, 1000))
		})

		it('it should work on a server stream', async () => {
			await reqRes.removeBtn.click()
			await requestSetup(3)
			await new Promise((resolve) => setTimeout( async () => {
				const jsonPretty = await reqRes.jsonPretty.getText();
				expect(jsonPretty).to.include(`test`)
				resolve()
			}, 1000))
	})
	})
}