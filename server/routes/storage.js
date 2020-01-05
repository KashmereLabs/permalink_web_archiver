
var express = require('express');
var router = express.Router();
var axios = require('axios');
const Arweave = require('arweave/node');
const PARSER_SERVER_URI = 'http://localhost:5000';


/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', { title: 'Express' });
});



router.post('/archive', function(req, res) {
  const { linkData } = req.body;
  console.log(linkData);
  res.send({"message": "success"});


});

module.exports = router;
