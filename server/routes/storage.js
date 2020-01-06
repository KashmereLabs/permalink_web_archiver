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
  res.send({ "message": "welcome to permalink web archiver" });
});

router.post('/archive', function(req, res) {
  let { linkData } = req.body;



  getBase64(linkData.image).then(function(imageDataResponse) {

    let articleImageStoreTransaction = arweave.createTransaction({
      data: imageDataResponse
    }, walletJWK);

    articleImageStoreTransaction.then(function(imageDataResponse) {
      imageDataResponse.addTag('Content-Type', 'image/jpeg');
      arweave.transactions.sign(imageDataResponse, walletJWK).then(function(signedTransactionResponse) {

        arweave.transactions.post(imageDataResponse).then(function(postResponse) {
          const imageTxnMeta = JSON.parse(postResponse.config.data);
          const imageURI = `https://arweave.net/${imageTxnMeta.id}`;
          linkData.image = imageURI;

          let pageHTMLText = Templates.getPageHTML(linkData);

          let articleStoreTransaction = arweave.createTransaction({
            data: pageHTMLText
          }, walletJWK);
          const uploaded_on = new Date();

          articleStoreTransaction.then(function(archiveResponse) {
            archiveResponse.addTag('Content-Type', 'text/html');
            archiveResponse.addTag('original-link', linkData.original_link);
            archiveResponse.addTag('article_tags', JSON.stringify(linkData.keywords))
            archiveResponse.addTag('uploaded_on', uploaded_on)
            archiveResponse.addTag('sentiment_score', linkData.sentiment)
            arweave.transactions.sign(archiveResponse, walletJWK).then(function(signedTransactionResponse) {

              arweave.transactions.post(archiveResponse).then(function(postResponse) {
                const transactionMeta = JSON.parse(postResponse.config.data);
                res.send({ "message": "success", "id": transactionMeta.id });
              });
            });
          });
        });
      });
    });
  })

});

router.get('/status', function(req, res) {
  const { id } = req.query;

  arweave.transactions.getStatus(id).then(status => {
    res.send(status);
  });
});


function getBase64(url) {
  return axios
    .get(url, {
      responseType: 'arraybuffer'
    })
    .then(response => Buffer.from(response.data, 'binary'))
}

module.exports = router;
