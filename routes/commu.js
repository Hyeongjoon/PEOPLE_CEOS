var express = require('express');
var router = express.Router();
var async = require('async');
var qna_boardDAO = require('../model/Qna_boardDAO');
var qna_replyDAO = require('../model/Qna_replyDAO');
var free_replyDAO = require('../model/Free_replyDAO');
var free_boardDAO = require('../model/Free_boardDAO');
var totalDAO = require('../model/TotalDAO');
var userDAO = require('../model/UserDAO');
var url = require('url');

/* GET users listing. */
router.get('/', function(req, res, next) {
	var countPage = 10;
	var tabNum = 0;
	var qna_pageNum = 1;
	var free_pageNum = 1;
	if(req.query!=undefined){
		if(req.query.tab==1){
			tabNum =1;
			if(req.query.pageNum!=undefined){
				free_pageNum = req.query.pageNum; 
			}
		} else{
			if(req.query.pageNum!= undefined){
				qna_pageNum = req.query.pageNum; 
			}
		}
	}
	var qna_info;
	var free_info;
	var qidArr;
	var fidArr;
	var totalQnaPageNum;
	var totalFreePageNum;
	async.waterfall([function(callback){
		totalDAO.findTotalBoard(callback);
	} , function(args , callback){
		var qna_totalNum = args[0].qna_num;
		var free_totalNum = args[0].free_num;
		var qna_countTop = countPage;
		var free_countTop = countPage;
		if(qna_pageNum * countPage > qna_totalNum){
			qna_countTop =  qna_totalNum - (qna_pageNum - 1) * countPage;
			if(qna_countTop<0){
				qna_countTop = 10
			}
		}
		if(free_pageNum * countPage > free_totalNum){
			free_countTop =  free_totalNum - (free_pageNum - 1) * countPage;
			if(free_countTop<0){
				free_countTop = 10
			}
		}
		totalQnaPageNum   =Math.floor(qna_totalNum/countPage +1); 
		totalFreePageNum  =Math.floor(free_totalNum/countPage +1);
		async.parallel([function(subCallback){
			qna_boardDAO.findBoard(qna_pageNum , qna_countTop , subCallback);
		} , function(subCallback){
			free_boardDAO.findBoard(free_pageNum , free_countTop , subCallback);
		}] , function(err , results){
			if(err){
				callback('err' , null);
			}else{
				callback(null , results[0] , results[1]);
			}
		}); // 여기까지가 해당 페이지에 대한 글정보 긁어오기
	} , function(args1 , args2 , callback){
		qna_info = args1;
		free_info = args2;
		var uidArr = [];
		for(var i = 0 ; i < qna_info.length ; i++){
			uidArr.push(qna_info[i].writer);
		}
		for(var i = 0 ; i < free_info.length ; i++){
			uidArr.push(free_info[i].writer);
		}
		userDAO.findNameByUidArr(uidArr , callback);
	}] , function(err , results){
		for(var i = 0 ; i < qna_info.length ; i++){
			for(var j = 0 ; j < results.length ; j++){
				if(qna_info[i].writer == results[j].uid){
					qna_info[i].name = results[j].name;
				}
			}
		}
		for(var i = 0 ; i < free_info.length ; i++){
			for(var j = 0 ; j < results.length ; j++){
				if(free_info[i].writer == results[j].uid){
					free_info[i].name = results[j].name;
				}
			}
		}
		qna_start = Math.floor((qna_pageNum-1)/5);
		if(qna_start<0){
			qna_start =0;
		}
		console.log(qna_start);
		free_start = Math.floor((free_pageNum-1)/5);
		if(free_start < 0){
			free_start = 0;
		}
		res.render('commu' , {title:'피플' , 
							  userName : req.session.passport.user.id , 
							  tabNum : tabNum, 
							  qna_info : qna_info, 
							  free_info : free_info,
							  qna_page_num : qna_pageNum,
							  qna_start : qna_start,
							  free_page_num : free_pageNum,
							  free_start : free_start,
							  total_qna_page_num : totalQnaPageNum,
							  total_free_page_num : totalFreePageNum,
							  });
	});
});

router.get('/qna_click' , function(req, res,next){
	if(req.query==undefined){
		res.redirect('/');
	} else{
		async.parallel([function(callback){
			qna_boardDAO.findBoardContent(req.query.qid , callback);
		} , function(callback){
			qna_replyDAO.findReply(req.query.qid , callback);
		}] , function(err , results){
			var qnaInfo = results[0][0];
			var qna_reply = results[1];
			var uidArr = [];
			for ( var i = 0 ; i <qna_reply.length ; i++){
				uidArr.push(qna_reply[i].writer);
			}
			uidArr.push(qnaInfo.writer);
			async.parallel([function(callback){
				userDAO.findNameByUidArr(uidArr , callback);
			} , function(callback){
				qna_boardDAO.updateSeenum(req.query.qid , callback);
			}] , function(err , results){
				for(var i = 0 ; i <qna_reply.length ; i++){
					for(var j = 0 ; j <results[0].length ; j++){
						if(results[0][j].uid == qna_reply[i].writer){
							qna_reply[i].name = results[0][j].name;
						}
					}
				}
				for(var i = 0 ; i < results[0].length ; i++){
					if (results[0][i].uid == qnaInfo.writer){
						qnaInfo.name = results[0][i].name;
						break;
					}
				}
				res.render('commu_qna_click' , {title:'피플' , 
												userName : req.session.passport.user.id , 
												qna_info : qnaInfo , 
												qna_reply : qna_reply , 
												my_id : req.session.passport.user.uid , 
												my_name : req.session.passport.user.name 
												});
			});
		});
	}
});

router.get('/free_click' , function(req, res,next){
	if(req.query==undefined){
		res.redirect('/');
	} else{
		async.parallel([function(callback){
			free_boardDAO.findBoardContent(req.query.fid , callback);
		} , function(callback){
			free_replyDAO.findReply(req.query.fid , callback);
		}] , function(err , results){
			var freeInfo = results[0][0];
			var free_reply = results[1];
			var uidArr = [];
			for ( var i = 0 ; i <free_reply.length ; i++){
				uidArr.push(free_reply[i].writer);
			}
			uidArr.push(freeInfo.writer);
			async.parallel([function(callback){
				userDAO.findNameByUidArr(uidArr , callback);
			} , function(callback){
				free_boardDAO.updateSeenum(req.query.fid , callback);
			}] , function(err , results){
				for(var i = 0 ; i <free_reply.length ; i++){
					for(var j = 0 ; j <results[0].length ; j++){
						if(results[0][j].uid == free_reply[i].writer){
							free_reply[i].name = results[0][j].name;
						}
					}
				}
				for(var i = 0 ; i < results[0].length ; i++){
					if (results[0][i].uid == freeInfo.writer){
						freeInfo.name = results[0][i].name;
						break;
					}
				}
				res.render('commu_free_click' , {title:'피플' , 
												userName : req.session.passport.user.id , 
												free_info : freeInfo , 
												free_reply : free_reply , 
												my_id : req.session.passport.user.uid , 
												my_name : req.session.passport.user.name 
												});
			});
		});
	}
});

router.post('/qna_reply' , function(req, res, next){
	async.parallel([function(callback){
		qna_replyDAO.register(req.body , callback);
	}] , function(err , result){
		if(err){
			res.send(false);
		} else{
			res.send({qrid : result[0].insertId});
		}
	});
});

router.post('/free_reply' , function(req, res,next){
	async.parallel([function(callback){
		free_replyDAO.register(req.body , callback);
	}] , function(err , result){
		if(err){
			res.send(false);
		} else{
			res.send({frid : result[0].insertId});
		}
	});
});

router.post('/qna_delete_reply' , function(req, res , next){
	async.parallel([function(callback){
		qna_replyDAO.deletion(req.body.qrid , req.session.passport.user.uid , callback);
	} , function(callback){
		qna_boardDAO.subReplyNum(req.body.qid , callback);
	}] , function(err , result){
		if(err){
			res.send(false);
		} else{
			res.send(true);
		}
	});
});

router.post('/free_delete_reply' , function(req, res , next){
	async.parallel([function(callback){
		free_replyDAO.deletion(req.body.frid , req.session.passport.user.uid , callback);
	} , function(callback){
		free_boardDAO.subReplyNum(req.body.fid , callback);
	}] , function(err , result){
		if(err){
			res.send(false);
		} else{
			res.send(true);
		}
	});
});

router.post('/qna_delete' , function(req , res , next){
	async.parallel([function(callback){
		qna_boardDAO.deletion(req.body.qid , req.session.passport.user.uid , callback);
	}] , function(err , result){
		if(err){
			res.send(false);
		} else{
			res.send(true);
		}
	});
});

router.post('/free_delete' , function(req , res , next){
	async.parallel([function(callback){
		free_boardDAO.deletion(req.body.fid , req.session.passport.user.uid , callback);
	}] , function(err , result){
		if(err){
			res.send(false);
		} else{
			res.send(true);
		}
	});
});

router.get('/qna_write' , function(req , res , next){
	res.render('commu_qna_write' , {title:'글쓰기' , userName : req.session.passport.user.id});
});

router.get('/free_write' , function(req , res , next){
	res.render('commu_free_write' , {title:'글쓰기' , userName : req.session.passport.user.id});
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

router.post('/free_register' , function(req, res, next){
	async.parallel([function(callback){
		var inform = req.body;
		inform.writer = req.session.passport.user.uid;
		free_boardDAO.register(inform , callback);
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

router.get('/find' , function(req, res,next){
	if(req.query==undefined){
		res.redirect('/commu?tab=0');
	} else if(req.query.tab==undefined || req.query.term==undefined || req.query.con == undefined || req.query.word == undefined){
		res.redirect('/commu?tab=0');
	} else if(req.query.term!==0 ||req.query.term!==1 ||req.query.term!==2 ||req.query.term!==3 ||req.query.con!==0 ||req.query.con!==1 ||req.query.con!==2 ||req.query.con!==3 ){
		res.redirect('/commu?tab=0');
	} else{
		var countPage = 10;
		var tabNum = 0;
		var qna_pageNum = 1;
		var free_pageNum = 1;
		if(req.query.tab==1){
			tabNum =1;
			if(req.query.pageNum!=undefined){
				free_pageNum = req.query.pageNum; 
			}
		} else{
			if(req.query.pageNum!= undefined){
				qna_pageNum = req.query.pageNum; 
			}
		}
		var qna_info;
		var free_info;
		var qidArr;
		var fidArr;
		var totalQnaPageNum;
		var totalFreePageNum;
		async.waterfall([function(callback){
			totalDAO.findTotalBoard(callback);
		} , function(args , callback){
			var qna_totalNum = args[0].qna_num;
			var free_totalNum = args[0].free_num;
			var qna_countTop = countPage;
			var free_countTop = countPage;
			if(qna_pageNum * countPage > qna_totalNum){
				qna_countTop =  qna_totalNum - (qna_pageNum - 1) * countPage;
				if(qna_countTop<0){
					qna_countTop = 10
				}
			}
			if(free_pageNum * countPage > free_totalNum){
				free_countTop =  free_totalNum - (free_pageNum - 1) * countPage;
				if(free_countTop<0){
					free_countTop = 10
				}
			}
			totalQnaPageNum   =Math.floor(qna_totalNum/countPage +1); 
			totalFreePageNum  =Math.floor(free_totalNum/countPage +1);
			async.parallel([function(subCallback){
				qna_boardDAO.findBoard(qna_pageNum , qna_countTop , subCallback);
			} , function(subCallback){
				free_boardDAO.findBoard(free_pageNum , free_countTop , subCallback);
			}] , function(err , results){
				if(err){
					callback('err' , null);
				}else{
					callback(null , results[0] , results[1]);
				}
			}); // 여기까지가 해당 페이지에 대한 글정보 긁어오기
		} , function(args1 , args2 , callback){
			qna_info = args1;
			free_info = args2;
			var uidArr = [];
			for(var i = 0 ; i < qna_info.length ; i++){
				uidArr.push(qna_info[i].writer);
			}
			for(var i = 0 ; i < free_info.length ; i++){
				uidArr.push(free_info[i].writer);
			}
			userDAO.findNameByUidArr(uidArr , callback);
		}] , function(err , results){
			for(var i = 0 ; i < qna_info.length ; i++){
				for(var j = 0 ; j < results.length ; j++){
					if(qna_info[i].writer == results[j].uid){
						qna_info[i].name = results[j].name;
					}
				}
			}
			for(var i = 0 ; i < free_info.length ; i++){
				for(var j = 0 ; j < results.length ; j++){
					if(free_info[i].writer == results[j].uid){
						free_info[i].name = results[j].name;
					}
				}
			}
			qna_start = Math.floor((qna_pageNum-1)/5);
			if(qna_start<0){
				qna_start =0;
			}
			console.log(qna_start);
			free_start = Math.floor((free_pageNum-1)/5);
			if(free_start < 0){
				free_start = 0;
			}
			res.render('commu' , {title:'피플' , 
								  userName : req.session.passport.user.id , 
								  tabNum : tabNum, 
								  qna_info : qna_info, 
								  free_info : free_info,
								  qna_page_num : qna_pageNum,
								  qna_start : qna_start,
								  free_page_num : free_pageNum,
								  free_start : free_start,
								  total_qna_page_num : totalQnaPageNum,
								  total_free_page_num : totalFreePageNum,
								  });
		});
	}
});



module.exports = router;
