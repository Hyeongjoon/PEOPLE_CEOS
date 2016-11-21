var EncryptHelper = require('../helper/EncryptHelper.js');
var email = require('nodemailer');
var config = require('../helper/config.js');

var emailTransport = email.createTransport(config.emailConfig);


var mailOption = {
		from : '"people" <people20161120@gmail.com>',
		to : '',
		subject : '',
		html : ''
}


exports.makeEmail = function(email , sessionId){
	mailOption.to = email;
	mailOption.subject='[people] 이메일 인증을 위한 링크가 발급 되었습니다.';
	var encryptedSessionId = EncryptHelper.encryptEmail(sessionId);
	mailOption.html = '<a href="http://52.78.208.137/verify/?'+encryptedSessionId+'">인증하기</a>';
	emailTransport.sendMail(mailOption , function(err , info){
		if(err){
			return console.log(err);
		}
		console.log(info.response);
	});
}