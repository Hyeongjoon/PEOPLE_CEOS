var express = require('express');
var router = express.Router();
var userDAO = require('../model/UserDAO');
var mailHelper = require('../helper/MakeEmail');
var async = require('async');

/* GET home page. */
router.get('/', function(req, res, next) {
	  res.render('register' , {title : '회원가입' });
});

router.post('/', function(req, res, next) {
	  async.waterfall([function(callback){
		  userDAO.findUserById(req.body.id , callback);
	  }, function(args1 , callback){
		  if(args1.length!=0){
			  callback('exsitId' , null);
		  }else{
			  userDAO.findUserByEmail(req.body.email , callback);
		  }
	  } , function(args1 , callback){
		  if(args1.length!=0){
			  callback('exsitEmail' , null);
		  } else{
			  if(req.body.password ==req.body.passwordcon){
				  console.log(req.body.birth_date);
				  req.session.inform={
						  id : req.body.id,
						  password : req.body.password,
						  name : req.body.name,
						  email : req.body.email,
						  phone_number : req.body.phone_number,
						  birth_date : req.body.birth_date,
						  gender : req.body.gender
				  }
				  mailHelper.makeEmail(req.body.email , req.sessionID);
				  callback(null , true);
			  } else{
				  console.log('어떤새끼가 다른방식으로 접근했네');
				  callback('serverErr' , null);
			  }
		  }
	  }] , function(err,results){
		  var result;
		  if(!err){
			  result =true;
		  } else if(err=='exsitId'){
			  result=err;
		  } else if(err=='exsitEmail'){
			  result=err;
		  } else {
			  result = false;
		  }
		  res.send({result:result});
	  });
});

module.exports = router;