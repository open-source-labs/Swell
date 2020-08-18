const chai = require('chai');
const chaiHttp = require('chai-http');
const sideBar = require('../pageObjects/Sidebar.js'); 
const reqRes = require('../pageObjects/ReqRes.js');

chai.use(chaiHttp);
const expect = chai.expect;

module.exports = () => {
	describe('HTTP/S requests', () => {

		const urlAndClick = async (url, method, body, header) => {
			if (method !== 'GET') {
				// request method
				await sideBar.requestMethod.click();
	
				if (method === 'POST') await sideBar.choosePost.click();
				if (method === 'PUT') await sideBar.choosePut.click();
				if (method === 'PATCH') await sideBar.choosePatch.click();
				if (method === 'DELETE') await sideBar.chooseDelete.click();
				
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

		beforeEach(async () => {
			await reqRes.removeBtn.click()
			}
		)

		describe('public API', () => {

			it('it should GET information from a public API', async () => {
				await sideBar.chooseGet.click();
				await urlAndClick('https://pokeapi.co/api/v2/pokemon?limit=5', 'GET');
				await new Promise((resolve) => setTimeout( async () => {
					const statusCode = await reqRes.statusCode.getText();
					const jsonPretty = await reqRes.jsonPretty.getText();
					expect(statusCode).to.equal('Status: 200')
					expect(jsonPretty).to.include('bulbasaur')
					resolve()
				}, 700))
			});
		})

		/***************** !! FOR BELOW TO WORK, YOU MUST ADD YOUR OWN MONGO URI TO A .ENV FILE WITH (MONGO_URI = "YOUR_URI") !! *****************/

		describe('local API', () => {
			before('CLEAR DB', (done) => {
				chai.request('http://localhost:3000')
				.get('/clear')
				.end((err, res) => {
					done();
				})
			})

			after('CLEAR DB', (done) => {
				chai.request('http://localhost:3000')
				.get('/clear')
				.end((err, res) => {
					done();
				})
			})

			it('it should GET from local API', async () => {
				await sideBar.chooseGet.click();
				await urlAndClick('http://localhost:3000/book', 'GET');
				await new Promise((resolve) => setTimeout( async () => {
					const statusCode = await reqRes.statusCode.getText();
					const jsonPretty = await reqRes.jsonPretty.getText();
					expect(statusCode).to.equal('Status: 200')
					expect(jsonPretty).to.equal('[]')
					resolve()
				}, 200))
			})

			it('it should not POST without a required field', async () => {
				await urlAndClick('http://localhost:3000/book', 'POST', `{"title": "HarryPotter"}`);
				await new Promise((resolve) => setTimeout( async () => {
					const statusCode = await reqRes.statusCode.getText();
					const jsonPrettyError = await reqRes.jsonPrettyError.getText();
					expect(statusCode).to.equal('Status: 500')
					expect(jsonPrettyError).to.include('validation failed');
					resolve()
				}, 200))
			})

			it('it should POST to local API', async () => {
				await urlAndClick('http://localhost:3000/book', 'POST', `{"title": "HarryPotter", "author": "JK Rowling", "pages": 500}`, 'show');
				await new Promise((resolve) => setTimeout( async () => {
					const statusCode = await reqRes.statusCode.getText();
					const jsonPretty = await reqRes.jsonPretty.getText();
					expect(statusCode).to.equal('Status: 200')
					expect(jsonPretty).to.include('JK Rowling')
					resolve()
				}, 200))
			})

			it('it should PUT to local API given a param', async () => {
				await urlAndClick('http://localhost:3000/book/HarryPotter', 'PUT', `{"author": "Ron Weasley", "pages": 400}`, 'show');
				await new Promise((resolve) => setTimeout( async () => {
					const statusCode = await reqRes.statusCode.getText();
					const jsonPretty = await reqRes.jsonPretty.getText();
					expect(statusCode).to.equal('Status: 200')
					expect(jsonPretty).to.include('Ron Weasley')
					resolve()
				}, 200))
			})

			it('it should PATCH to local API given a param', async () => {
				await urlAndClick('http://localhost:3000/book/HarryPotter', 'PATCH', `{"author": "Hermoine Granger"}`, 'show');
				await new Promise((resolve) => setTimeout( async () => {
					const statusCode = await reqRes.statusCode.getText();
					const jsonPretty = await reqRes.jsonPretty.getText();
					expect(statusCode).to.equal('Status: 200')
					expect(jsonPretty).to.include('Hermoine Granger')
					resolve()
				}, 200))
			})

			it('it should DELETE in local API given a param', async () => {
				await urlAndClick('http://localhost:3000/book/HarryPotter', 'DELETE', `{}`, 'show');
				await new Promise((resolve) => setTimeout( async () => {
					const statusCode = await reqRes.statusCode.getText();
					const jsonPretty = await reqRes.jsonPretty.getText();
					expect(statusCode).to.equal('Status: 200')
					expect(jsonPretty).to.include('Hermoine Granger')
					resolve()
				}, 200))
				await reqRes.removeBtn.click();
				await sideBar.chooseGet.click();
				await urlAndClick('http://localhost:3000/book', 'GET');
				await new Promise((resolve) => setTimeout( async () => {
					const statusCode = await reqRes.statusCode.getText();
					const jsonPretty = await reqRes.jsonPretty.getText();
					expect(statusCode).to.equal('Status: 200')
					expect(jsonPretty).to.equal('[]')
					resolve()
				}, 200))
			})
		})
	})
}
