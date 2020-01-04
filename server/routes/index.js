var express = require('express');
var router = express.Router();
var axios = require('axios');
const Arweave = require('arweave/node');


const instance = Arweave.init({
  host: '127.0.0.1',
  port: 1984,
  protocol: 'http'
});


/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', { title: 'Express' });
});



router.get('/connect', function(req, res) {


});

module.exports = router;
