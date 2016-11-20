var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	  res.render('register' , {title : '회원가입' });
});

router.post('/', function(req, res, next) {
	  console.log(req.body);
	  res.send({result:true});
});

module.exports = router;