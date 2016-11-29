var express = require('express');
var router = express.Router();
var async = require('async');
var hsDAO = require('../model/HsDAO');
var totalDAO = require('../model/TotalDAO')
var hs_weekDAO = require('../model/Hs_weekDAO');
var url = require('url');
var decryptHelper = require('../helper/DecryptHelper');

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
	var parseObject = url.parse(req.url);
	var tabNum;
	if(parseObject.query ==0){
		tabNum =0;
	} else if(parseObject.query ==1){
		tabNum =1;
	} else if(parseObject.query ==2){
		tabNum =2;
	} else{
		tabNum =0;
	}
	async.parallel([function(callback){
		totalDAO.findTotalInfo(callback);
	} , function(callback){
		hs_weekDAO.load5History(callback);
	} , function(callback){
		hsDAO.load_com_and_bdc_num(callback);
	}] , function(err , results){
		var info = { total : results[0][0] , week : results[1] , day : results[2]};
		res.render('about_people', { title: '피플' , chklog : chklog , userName : userName , tabNum : tabNum , info : info});
	});
		  
});


module.exports = router;
