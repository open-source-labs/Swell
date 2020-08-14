const chai = require('chai');
const chaiHttp = require('chai-http');
const { resolve } = require('path');
const sideBar = require('../pageObjects/Sidebar.js'); 
const reqRes = require('../pageObjects/ReqRes.js');
const db = require('../dbModel')

chai.use(chaiHttp);
const expect = chai.expect;

module.exports = () => {
	describe('HTTP/S requests', () => {
		describe('public API', () => {

			it('it should GET information from a public API', async () => {
				await sideBar.url.addValue('pokeapi.co/api/v2/pokemon?limit=5'); 
				await sideBar.addRequestBtn.click();
				await reqRes.sendBtn.click();
				await new Promise((resolve) => setTimeout( async () => {
					const statusCode = await reqRes.statusCode.getText();
					const jsonKey = await reqRes.jsonKey.getText();
					const jsonValue = await reqRes.jsonValue.getText();
					console.log(statusCode, jsonKey, jsonValue);
					expect(statusCode).to.equal('Status: 200')
					expect(jsonKey).to.equal('count')
					expect(jsonValue).to.equal('964')
					resolve()
				}, 3000))
			});
		})

		/*
		For the below tests to work, you have to start up the mock server by typing in
		*/
		describe('local API', () => {
			it('it should GET from local API', (done) => {
				chai.request('http://localhost:3000')
				.get('/')
				.end((err, res) => {
					expect(err).to.be.null;
					expect(res).to.have.status(201);
					done();
				})
			})
		})
	})
}
