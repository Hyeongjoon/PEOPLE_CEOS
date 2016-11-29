var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('donor' , {title:'피플' , userName : req.session.passport.user.id});
});


module.exports = router;
