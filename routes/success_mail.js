var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('success_mail' , {title:'피플'});
});

module.exports = router;
