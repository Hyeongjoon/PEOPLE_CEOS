var express = require('express');
var router = express.Router();
var passport = require('../app').passport;

router.post('/', function(req, res, next) {
	  passport.authenticate('local', function(err, user, info) {
		    if (err) { return next(err); }
		    if (!user) { return res.json({result:false});}
		    req.logIn(user, function(err) {
		      if (err) { return next(err); }
		      return res.json({result:true});
		    });
		  })(req, res, next);
		});  
		
module.exports = router;