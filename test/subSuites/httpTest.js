const chai = require('chai');
const chaiHttp = require('chai-http');
const sideBar = require('../pageObjects/Sidebar.js'); 
const reqRes = require('../pageObjects/ReqRes.js');
const server = require('../fakeSEEServer')

chai.use(chaiHttp);
const expect = chai.expect;

module.exports = () => {
	const urlAndClick = async (url) => {
		await sideBar.url.addValue(url); 
		await sideBar.addRequestBtn.click();
		await reqRes.sendBtn.click();
	}

	describe('HTTP/S requests', () => {
		describe('public API', () => {

			it('it should GET information from a public API', async () => {
				urlAndClick('pokeapi.co/api/v2/pokemon?limit=5');
				await new Promise((resolve) => setTimeout( async () => {
					const statusCode = await reqRes.statusCode.getText();
					const jsonKey = await reqRes.jsonKey.getText();
					const jsonValue = await reqRes.jsonValue.getText();
					// console.log(statusCode, jsonKey, jsonValue);
					expect(statusCode).to.equal('Status: 200')
					expect(jsonKey).to.equal('count')
					expect(jsonValue).to.equal('964')
					resolve()
				}, 2000))
				await reqRes.removeBtn.click();
			});
		})

		describe('local API', () => {
			// TODO: write logic to clear database before first test
			before('CLEAR DB', (done) => {
				chai.request('http://localhost:3000')
				.get('/clear')
				.end((err, res) => {
					done();
				})
			})

			it('it should GET from local API', async () => {
				urlAndClick('localhost:3000/book');
				await new Promise((resolve) => setTimeout( async () => {
					const statusCode = await reqRes.statusCode.getText();
					const jsonPretty = await reqRes.jsonPretty.getText();
					// console.log(statusCode, jsonPretty);
					expect(statusCode).to.equal('Status: 200')
					expect(jsonPretty).to.equal('[]')
					resolve()
				}, 2000))
				await reqRes.removeBtn.click();
			})
		})
	})
}
