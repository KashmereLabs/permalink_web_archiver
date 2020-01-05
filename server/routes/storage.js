var express = require('express');
var router = express.Router();
var axios = require('axios');
const Arweave = require('arweave/node');
const PARSER_SERVER_URI = 'http://localhost:5000';
const walletJWK = require('../wallet.json');
const Templates = require('../model/template');

const arweave = Arweave.init({
  host: 'arweave.net',
  protocol: 'https'
});

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', { title: 'Express' });
});



router.post('/archive', function(req, res) {
  const { linkData } = req.body;
  //  console.log(linkData);
  let pageHTMLText = Templates.getPageHTML(linkData);


  let transactionB = arweave.createTransaction({
    data: pageHTMLText
  }, walletJWK);

  transactionB.then(function(archiveResponse) {
    archiveResponse.addTag('Content-Type', 'text/html');
    archiveResponse.addTag('origina-link', 'value2');

    // console.log(archiveResponse);

    arweave.transactions.sign(archiveResponse, walletJWK).then(function(signedTransactionResponse) {

      arweave.transactions.post(archiveResponse).then(function(postResponse) {
        const transactionMeta = JSON.parse(postResponse.config.data);
        res.send({ "message": "success", "id": transactionMeta.id });
      });
    });
  });
});


router.get('/status', function(req, res) {
  const { id } = req.query;

  arweave.transactions.getStatus(id).then(status => {
    console.log(status);
    res.send(status);
  });
});

module.exports = router;
