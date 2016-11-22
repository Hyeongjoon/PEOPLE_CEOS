var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	var chklog=false;
	var userName;
	if(req.session.passport!==undefined){
		chklog=true;
		userName = req.session.passport.user.id;
	} 
  res.render('index', { title: '피플' , chklog : chklog , userName : userName});
});


module.exports = router;
