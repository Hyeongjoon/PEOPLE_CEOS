var express = require('express');
var router = express.Router();
var async = require('async');
var hsDAO = require('../model/HsDAO');

/* GET home page. */
router.get('/', function(req, res, next) {
	var chklog=false;
	var userName;
	if(req.session.passport!==undefined){
		if(req.session.passport.user!=undefined){//중간에 서버 껏다 켰을때 세션에 패스포트는 남아있을수도 있어서 시발 개발초기단계에서만 일어나는거긴한데 일단 달아놈
		chklog=true;
		userName = req.session.passport.user.id;
		}
	}
	async.waterfall([function(callback){
		hsDAO.loadWeekHistory(callback);
	}] , function(err , result){
		res.render('index', { title: '피플' , chklog : chklog , userName : userName , hs:result});
	})
  
});


module.exports = router;
