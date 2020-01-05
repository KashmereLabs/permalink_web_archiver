import React, { Component } from 'react';
import { Form, Button, Container, Row, Col, Badge, Alert } from 'react-bootstrap';
import axios from 'axios';
const APP_SERVER_URI = process.env.REACT_APP_API_URI;

export default class Landing extends Component {

  constructor(props) {
    super(props);
    this.state = { "inputURI": "", "transactionStatus": "init", "transactionId": "" };
  }

  submitURLForm = (e) => {
    e.preventDefault();
    const { inputURI } = this.state;

    const payload = { url: inputURI };
    const self = this;

    axios.post(`${APP_SERVER_URI}/link/extract`, payload).then(function(dataResponse) {
      self.setState({ "linkPreview": dataResponse.data.data, "transactionStatus": "init", "transactionId": "" });
    });
  }

  inputURIChanged = (evt) => {
    this.setState({ inputURI: evt.target.value });
  }

  archiveLink = () => {
    const { linkPreview } = this.state;
    const payload = Object.assign({}, linkPreview, { "summary": encodeURI(linkPreview.summary), "full_text": encodeURI(linkPreview.full_text) })
    const self = this;
    console.log(payload);

    axios.post(`${APP_SERVER_URI}/storage/archive`, { "linkData": payload }).then(function(archiveResponse) {
      if (archiveResponse.data.message === 'success') {
        self.setState({ "transactionId": archiveResponse.data.id, "transactionStatus": "pending" }, function() {
          self.startTimer();
        });
      }
    });
  }

  startTimer = () => {
    const self = this;
    const { transactionId } = this.state;
    this.timer = setInterval(function() {
      axios.get(`${APP_SERVER_URI}/storage/status?id=${transactionId}`).then(function(transactionStatusResponse) {
        console.log(transactionStatusResponse.data.confirmed);
        const confirmStatus = transactionStatusResponse.data.confirmed;
        console.log(confirmStatus);
        if (confirmStatus !== null) {
          self.stopTimer();
        }
      });
    }, 3000);
  }

  stopTimer = () => {
    console.log("Stopping timer");
    clearInterval(this.timer);
    this.setState({ transactionStatus: "confirmed" });

  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const { inputURI, linkPreview, transactionStatus, transactionId } = this.state;
    let textPreviewView = <span/>;
    if (linkPreview) {
      textPreviewView = <LinkDataPreview previewData={linkPreview}/>
    }
    let currentTransactionStatus = <span/>;
    if (transactionStatus === 'pending') {
      currentTransactionStatus = <div><i className=""/>Transaction is pending. Once confirmed your archived webpage will be available at https://arweave.net/{transactionId}</div>
    }
    if (transactionStatus === 'confirmed') {
      currentTransactionStatus = <div>Your transaction is confirmed. You can view your archived page at <a href={`https://arweave.net/${transactionId}`}>https://arweave.net/{transactionId}</a></div>
    }

    let archiveButton = <span/>;
    if (linkPreview) {
      archiveButton = <Button onClick={this.archiveLink} className="app-button">Archive Link</Button>;
    }

    let currentAlert = <Alert  variant="info" className="app-alert-bar">
                         Please make sure that you do not archive links with copyrighted content or images.
                      </Alert>;
    if (linkPreview && transactionStatus === 'init') {
      currentAlert = <Alert variant="primary" className="app-alert-bar">Your document is now ready to be archived</Alert>
    }
    if (linkPreview && transactionStatus === 'pending') {
      currentAlert = <Alert variant="info">
      <div><i className="fas fa-spinner fa-spin"/> Your transaction has been broadcast and is currently pending.</div>
      <div>When confirmed the archived file will be available at <a href={`https://arweave.net/${transactionId}`} target="_blank">https://arweave.net/{transactionId}</a></div>
      </Alert>
    }
    if (linkPreview && transactionStatus === 'confirmed') {
      currentAlert = <Alert variant="success">
      <div>Your transaction has been successfully confirmed. </div>
      <div>You can view your archived page at <a href={`https://arweave.net/${transactionId}`} target="_blank">https://arweave.net/{transactionId}</a></div>
      </Alert>

    }
    return (
      <Container>
        <div className="link-archiver-body-container">
          <div className="link-archive-form-container">
          <Form onSubmit={this.submitURLForm}>
            <Form.Group controlId="formBasicEmail">
              <Form.Control type="text" placeholder="Paste the URL you want to archive" value={inputURI} onChange={this.inputURIChanged}/>
            </Form.Group>
            <Button variant="secondary" type="submit" className="app-button">Preview</Button>
            {archiveButton}
          </Form>
          </div>
          <div>
          {currentAlert}
          </div>
          <div>
            {textPreviewView}
          </div>
        </div>
      </Container>
    )
  }
}


class LinkDataPreview extends Component {
  render() {
    const { previewData } = this.props;
    console.log(previewData);
    let keywordList = <span/>;
    if (previewData.keywords) {
      keywordList = <div>{previewData.keywords.map(function(keyword, idx){
        return <Badge pill variant="light" key={`${keyword}-${idx}`}>{keyword}</Badge>
      })}</div>
    }

    function createMarkup() {
      return { __html: previewData.full_text };
    }
    return (
      <div>
        <h3>{previewData.title}</h3>
        <Row>
          <Col lg={6}><img src={previewData.image} className="preview-image-class"/></Col>
          <Col lg={6}>
            <div className="h4">Summary</div>
            <div>{previewData.summary}</div>
            <div className="h4">Tags</div>
            {keywordList}
            <h4>Article Sentiment</h4>
            
          </Col>
        </Row>
        <Row>
        <Col lg={12} className="text-container">
          <div className="h3">Full text</div>
          <div className="article-full-text-container">
            <div dangerouslySetInnerHTML={createMarkup()}/>
          </div>
        </Col>  
        </Row>
      </div>
    )
  }
}
