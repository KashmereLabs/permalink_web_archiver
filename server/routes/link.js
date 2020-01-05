var express = require('express');
var router = express.Router();
var axios = require('axios');
const Arweave = require('arweave/node');
const PARSER_SERVER_URI = 'http://localhost:5000';


/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', { title: 'Express' });
});



router.post('/extract', function(req, res) {
  const { url } = req.body;


  axios.get(`${PARSER_SERVER_URI}/fetch?url=${url}`).then(function(dataResponse) {

    res.send({ "message": "success", "data": dataResponse.data });
  });

});

module.exports = router;
