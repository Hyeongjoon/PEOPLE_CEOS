var cryptoJS = require('crypto-js');	
var config = require('./config.js');

exports.encryption = function(input){
	var result = cryptoJS.AES.encrypt(input , config.dbSecretKey);
	return result.toString();
}

exports.encryptEmail = function(input){
	var result = cryptoJS.AES.encrypt(input , config.emailSecretKey);
	return result.toString();
}