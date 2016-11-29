var express = require('express');
var router = express.Router();
var async = require('async');
var qna_boardDAO = require('../model/Qna_boardDAO');
var url = require('url');

/* GET users listing. */
router.get('/', function(req, res, next) {
	var countPage = 10;
	var tabNum = 0;
	if(req.query.tab==undefined){
		res.render('commu' , {title:'피플' , userName : req.session.passport.user.id , tabNum : tabNum});
	} else if(req.query.tab==1){
		tabNum =1;
	} else {
		
	}
	//tabNum 없을땐  바로 보내주기
	//pageNum 없을때도 바로 넘기기
  res.render('commu' , {title:'피플' , userName : req.session.passport.user.id});
});

router.get('/qna_write' , function(req , res , next){
	res.render('commu_qna_write' , {title:'피플' , userName : req.session.passport.user.id});
});

router.post('/register' , function(req, res, next){
	async.parallel([function(callback){
		var inform = req.body;
		inform.writer = req.session.passport.user.uid;
		qna_boardDAO.register(inform , callback);
	}] , function(err, result){
		if(err){
			res.send(false);
		} else if(result ==false){
			res.send(false);
		} else{
			res.send(true);
		}
	});
});



module.exports = router;
