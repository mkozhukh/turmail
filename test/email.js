var expect = require('chai').expect;
var assert = require('chai').assert;
var mail = require("../index.js");


//set mailgun key to run the sending test
var key; //="mailgun key";

mail.init({ path: "./templates", key:key, domain:"mail.webix.io" });

describe("turmail", ()=>{
	it('fills envelope with email', ()=>{
		return mail.getText("Test").then(text => {
			expect(text).to.equal(`Message: Test `);			
		});
	});
	it('fills email with data', ()=> {
		return mail.getText("Test", { name:"Maksim" }).then(text => {
			expect(text).to.equal(`Message: Test Maksim`);			
		});
	});
	it('get from and subject fields', ()=> {
		return mail.getEmail("Test").then(mail => {
			expect(mail.letter.from).to.equal(`some@ya.ru`);
			expect(mail.letter.subject).to.equal(`Test email`);
			expect(mail.text({ name:"Maksim" })).to.equal(`Message: Test Maksim`);
		});
	});
	it('sends email', () =>{
		if (!key) return true;

		return mail.send("Test", { 
			name:"Maksim",
			to:"some@ya.ru",
			test:true
		}).then(function(){
			assert(true);
		});
	})
})