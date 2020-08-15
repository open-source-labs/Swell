const chai = require('chai');
const chaiHttp = require('chai-http');
const sideBar = require('../pageObjects/Sidebar.js'); 
const reqRes = require('../pageObjects/ReqRes.js');

chai.use(chaiHttp);
const expect = chai.expect;

module.exports = () => {

	const urlAndClick = async (url, method, body, header) => {
		if (method !== 'GET') {
			// request method
			await sideBar.requestMethod.click();
			await sideBar.choosePost.click();
			
			// headers
			if (header !== 'show') {
				await sideBar.activateHeaders.click();
			}
			await sideBar.headerKey.addValue('Content-Type');
			await sideBar.headerValue.addValue('application/json');
			await sideBar.addHeader.click();
			
			// content type
			await sideBar.contentTypeBtn.click();
			await sideBar.chooseJSON.click();

			// body
			await sideBar.bodyInput.clearElement();
			await sideBar.bodyInput.addValue(body);
		}
		await sideBar.url.clearElement();
		await sideBar.url.addValue(url); 
		await sideBar.addRequestBtn.click();
		await reqRes.sendBtn.click();
	}

	describe('HTTP/S requests', () => {
		describe('public API', () => {

			// it('it should GET information from a public API', async () => {
			// 	urlAndClick('https://pokeapi.co/api/v2/pokemon?limit=5', 'GET');
			// 	await new Promise((resolve) => setTimeout( async () => {
			// 		const statusCode = await reqRes.statusCode.getText();
			// const jsonPretty = await reqRes.jsonPretty.getText();
			// 		expect(statusCode).to.equal('Status: 200')
			// expect(jsonPretty).to.include('bulbasaur')
			// 		resolve()
			// 	}, 2000))
			// 	await reqRes.removeBtn.click();
			// });
		})

		describe('local API', () => {
			before('CLEAR DB', (done) => {
				chai.request('http://localhost:3000')
				.get('/clear')
				.end((err, res) => {
					done();
				})
			})

			it('it should GET from local API', async () => {
				urlAndClick('http://localhost:3000/book', 'GET');
				await new Promise((resolve) => setTimeout( async () => {
					const statusCode = await reqRes.statusCode.getText();
					const jsonPretty = await reqRes.jsonPretty.getText();
					expect(statusCode).to.equal('Status: 200')
					expect(jsonPretty).to.equal('[]')
					resolve()
				}, 2000))
				await reqRes.removeBtn.click();
			})

			it('it should not POST without a missing required field', async () => {
				await urlAndClick('http://localhost:3000/book', 'POST', `{"title": "Harry Potter"}`);
				await new Promise((resolve) => setTimeout( async () => {
					const statusCode = await reqRes.statusCode.getText();
					const jsonPrettyError = await reqRes.jsonPrettyError.getText();
					expect(statusCode).to.equal('Status: 500')
					expect(jsonPrettyError).to.include('validation failed');
					resolve()
				}, 2000))
				await reqRes.removeBtn.click();
			})

			it('it should POST to local API', async () => {
				await urlAndClick('http://localhost:3000/book', 'POST', `{"title": "Harry Potter", "author": "JK Rowling"}`, 'show');
				await new Promise((resolve) => setTimeout( async () => {
					const statusCode = await reqRes.statusCode.getText();
					const jsonPretty = await reqRes.jsonPretty.getText();
					expect(statusCode).to.equal('Status: 200')
					expect(jsonPretty).to.include('Harry Potter')
					resolve()
				}, 3000))
				await reqRes.removeBtn.click();
			})
		})
	})
}
