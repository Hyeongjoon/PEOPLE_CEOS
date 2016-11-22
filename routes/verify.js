var express = require('express');
var router = express.Router();
var async = require('async');
var url = require('url');

var userDAO = require('../model/UserDAO');
var encryptHelper = require('../helper/EncryptHelper');


router.get('/', function(req, res, next) {
	  async.waterfall([function(callback){
		  req.session.inform.password = encryptHelper.encryption(req.session.inform.password);
		  req.session.inform.email_verify = true;
		  userDAO.register(req.session.inform , callback);
	  }] , function(err , results){
		  if(err){
			  res.render('failRegister' , {});
			  //DB에 안들어가고 오류될시
		  } else{
			  res.render('registerSuccess' , {title : 'people'});
		  }
	  });
	});

module.exports = router;