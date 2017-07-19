var path = require("path");
var yaml = require("js-yaml");
var promise = require("bluebird");
var handlebars = require('handlebars');
var fs = promise.promisifyAll(require("fs"));

//compare operations in email templates
handlebars.registerHelper('equal', function(lvalue, rvalue, options) {
    if( lvalue!=rvalue ) {
        return options.inverse(this);
    } else {
        return options.fn(this);
    }
});

var templates_path;
var mailgun;

var use_cache = true;
var email_cache = {};
var envelope_cache = {};

function getLetter(file){
	if (use_cache && email_cache[file])
		return promise.resolve(email_cache[file]);

	return fs.readFileAsync( path.join(templates_path, "letters", file+".yaml"), "utf-8")
		.then(text => {
			var temp = email_cache[file] = yaml.safeLoad(text)
			temp.id = file;
			return temp;
		});
}
function getEnvelope(file, data){
	if (use_cache && envelope_cache[file+"*"+data.id])
		return promise.resolve(envelope_cache[file+"*"+data.id]);
	return fs.readFileAsync( path.join(templates_path, "envelopes", file+".html"), "utf-8")
		.then(text => envelope_cache[file+"*"+data.id] = handlebars.compile(handlebars.compile(text)(data)));
}

function getEmail(letter_id){
	return getLetter(letter_id)
		.then(letter => {
			return getEnvelope(letter.envelope, letter)
				.then(text => ({ letter, text }) );
		});
}

function init(options){
	mailgun = promise.promisifyAll(
		require('mailgun-js')({apiKey: options.key, domain: options.domain})
	);
	
	templates_path = options.path;
	use_cache = !(options.cache === false);
}
function send(letter_id, data){ 
	return getEmail(letter_id)
		.then(email => mailgun.messages().send({
			from: data.from || email.letter.from,
			to: data.to || email.letter.to,
			subject: data.subject || email.letter.subject,
			html: email.text(data),
			'o:testmode': email.test
		}));
}
function getText(letter_id, obj){
	return getEmail(letter_id)
		.then(email => email.text(obj));
}

module.exports = {
	init:init,
	send:send,
	getText:getText,
	getEmail:getEmail
};