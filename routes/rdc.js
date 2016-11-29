var express = require('express');
var router = express.Router();
var originDAO = require('../model/OriginDAO');
var bdcDAO = require('../model/BdcDAO');
var userDAO = require('../model/UserDAO');
var curTransDAO = require('../model/Cur_transDAO');
var transDAO = require('../model/TransDAO');
var async = require('async');

/* GET users listing. */
router.get('/', function(req, res, next) {
	async.parallel([function(callback){
		bdcDAO.findCurOwn(req.session.passport.user.uid , callback);
	} , function(callback){
		curTransDAO.findCurToTrans(req.session.passport.user.uid , callback);
	} , function(callback){
		var inform;
		async.waterfall([function(subcallback){
			curTransDAO.findCurFromTrans(req.session.passport.user.uid , subcallback);
		} , function(args1 , subcallback){
			if(args1.length==0){
				subcallback(null , false);
			}else{
				inform = args1;
				userDAO.findNameByFromUidArr(args1, subcallback);
			}
		}] , function(err , results){
			if(err){
				callback('에러' , null)
			} else if(results==false){
				callback(null , [])
			} else {
				for(var i = 0 ; i < inform.length; i++){
					for(var j = 0 ; j <results.length ; j++){
						if(inform[i].from_id==results[j].uid){
							inform[i].from_name = results[j].name;
						}
					}
				}
				callback(null , inform);
			}
		});
	}] , function(err , result){
		for (var i = 0 ; i < result[0].length ; i++){
			for(var j = 0 ; j < result[1].length ; j++){
				if(result[0][i].bid == result[1][j].bdc_id){
					result[1][j].bdc_num = result[0][i].bdc_num;
				}
			}
		}
		res.render('rdc' , {title:'피플' , userName : req.session.passport.user.id , bdc_inform:result[0],
					cur_to_trans : result[1] , cur_from_trans : result[2]
					});
	});
  
});

router.post('/find_origin' , function(req,res,next){
	async.parallel([function(callback){
		originDAO.findOriginName(req.body.origin_name , callback);
	}] , function(err , results){
		if(err){
			res.send({result :false});
		} else if(results.length==0){
			res.send({result :false});
		} else{
			res.send(results[0]);
		}
	});
});

router.post('/register' , function(req,res,next){
	var inform = req.body;
	inform.origin_own = req.session.passport.user.uid;
	inform.current_own =  req.session.passport.user.uid;
	async.parallel([function(callback){
		bdcDAO.register(inform, callback);
	}] , function(err , results){
		if(err){
			res.send({result :false});
		} else if(results[0] == false){
			res.send({result :false});
		} else{
			res.send({result :true});
		}
	});
});

router.post('/find_people' , function(req,res,next){
	async.parallel([function(callback){
		userDAO.findUserByNameNotMe(req.body.name, req.session.passport.user.uid , callback);
	}] , function(err , results){
		if(err){
			res.send(false);
		} else if(results[0].length==0){
			res.send(false);
		} else {
			res.send(results[0]);
		}
	});
});

router.post('/trans_register' , function(req,res,next){
	async.parallel([function(callback){
		var inform= req.body;
		inform.from_id = req.session.passport.user.uid;
		curTransDAO.register(inform , callback);
	} , function(callback){
		bdcDAO.disabled(req.body.bdc_id, req.session.passport.user.uid , callback);
	}] , function(err ,results){
		if(err){
			res.send(false);
		} else {
			res.send(true);
		}
	});
});

router.post('/trans_cancel' , function(req , res,next){
	async.parallel([function(callback){
		bdcDAO.abled(req.body.bdc_id , req.session.passport.user.uid , callback);
	} , function(callback){
		curTransDAO.deleteTrans(req.body.bdc_id , req.session.passport.user.uid , callback);
	}] , function(err , results){
		if(err){
			res.send(false);
		} else{
			res.send(true);
		}
	});
});

router.post('/pass_ok' , function(req , res , next){
	async.series([function(callback){
		bdcDAO.updateCurOwn(req.body.bdc_id , req.session.passport.user.uid , callback);
	} , function(callback){
		var inform = req.body;
		inform.to_id = req.session.passport.user.uid;
		transDAO.register(inform , callback);
	} , function(callback){
		bdcDAO.abled(req.body.bdc_id , req.session.passport.user.uid , callback)
	}] , function(err,results){
		if(err){
			res.send(false);
		} else{
			res.send(true);
		}
	});
});

router.post('/pass_cancel' , function(req , res , next){
	async.parallel([function(callback){
		bdcDAO.abled(req.body.bdc_id ,req.body.from_id,callback);
	} , function(callback){
		curTransDAO.deleteTrans(req.body.bdc_id ,req.body.from_id,callback);
	}] , function(err , results){
		if(err){
			res.send(false);
		} else{
			res.send(true);
		}
	});
});

module.exports = router;
