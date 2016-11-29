var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	console.log(req.session.passport);
  res.render('myPage' , {title:'피플' , userName : req.session.passport.user.id , userInfo : req.session.passport.user});
});


module.exports = router;
