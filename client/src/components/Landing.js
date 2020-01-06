import React, { Component } from 'react';
import { Form, Button, Container, Row, Col, Badge, Alert } from 'react-bootstrap';
import axios from 'axios';
const APP_SERVER_URI = process.env.REACT_APP_API_URI;

export default class Landing extends Component {

  constructor(props) {
    super(props);
    this.state = { "inputURI": "", "transactionStatus": "init", "transactionId": "", recentArchives: [] };
  }

  componentWillMount() {
    const self = this;
    axios.get(`${APP_SERVER_URI}/storage/recent_archives`).then(function(dataResponse) {
      console.log(dataResponse);
      self.setState({ "recentArchives": dataResponse.data.data });
    });
  }

  submitURLForm = (e) => {
    e.preventDefault();
    const { inputURI } = this.state;

    const payload = { url: inputURI };
    const self = this;

    axios.post(`${APP_SERVER_URI}/link/extract`, payload).then(function(dataResponse) {
      let previewData = dataResponse.data.data;
      let sentiment_text = "";
      let setimentScore = Number(previewData.sentiment);
      if (setimentScore >= 0.5) {
        sentiment_text = <span>&#9786; very positive</span>;
      }
      if (setimentScore >= 0 && setimentScore <= 0.5) {
        sentiment_text = <span>&#9786; slightly positive</span>;
      }
      if (setimentScore < 0 && setimentScore >= -0.5) {
        sentiment_text = <span>&#9785; slightly negative</span>;
      }
      if (setimentScore < -0.5) {
        sentiment_text = <span>&#9785; very negative</span>;
      }

      self.setState({ "linkPreview": Object.assign({}, previewData, { sentiment_text: sentiment_text }), "transactionStatus": "init", "transactionId": "" });
    });
  }

  inputURIChanged = (evt) => {
    this.setState({ inputURI: evt.target.value });
  }

  archiveLink = () => {
    const { linkPreview } = this.state;
    const payload = Object.assign({}, linkPreview, { "summary": encodeURI(linkPreview.summary), "full_text": encodeURI(linkPreview.full_text) })
    const self = this;
    this.setState({ "transactionStatus": "loading" });

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
        const confirmStatus = transactionStatusResponse.data.confirmed;
        if (confirmStatus !== null) {
          self.stopTimer();
        }
      });
    }, 3000);
  }

  stopTimer = () => {
    clearInterval(this.timer);
    this.setState({ transactionStatus: "confirmed" });

  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const { inputURI, linkPreview, transactionStatus, transactionId, recentArchives } = this.state;
    let textPreviewView = <span/>;
    if (linkPreview) {
      textPreviewView = <LinkDataPreview previewData={linkPreview}/>
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
    if (transactionStatus === 'loading') {
      currentAlert = <Alert variant="info"><i className="fas fa-spinner fa-spin"/> Please wait</Alert>
    }
    let recentArchiveView = <span/>;
    if (recentArchives && recentArchives.length > 0) {
      recentArchiveView = <RecentArchives archiveData={recentArchives}/>
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
          <div>
            {recentArchiveView}
          </div>
        </div>
      </Container>
    )
  }
}


class LinkDataPreview extends Component {
  render() {
    const { previewData } = this.props;

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
        <div className="article-subheading-container">
          <div className="article-subheading-label">Authors</div><div className="article-subheading-text"> {previewData.authors}</div> 
          <div className="article-subheading-label">Published on </div><div className="article-subheading-text">{previewData.publish_date}</div> 
          <div className="article-subheading-label">Sentiment</div><div className="article-subheading-text">{previewData.sentiment_text}</div> 
        </div>
        <Row>
          <Col lg={6}><img src={previewData.image} className="preview-image-class"/></Col>
          <Col lg={6}>
            <div className="h4">Summary</div>
            <div>{previewData.summary}</div>
            <div className="h4">Tags</div>
            {keywordList}
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


class RecentArchives extends Component {
  render() {
    const { archiveData } = this.props;
    let archiveList = archiveData.map((txId) => (<div><a href={`https://arweave.net/${txId}`}>Link</a></div>))
    return (
      <div>
        {archiveList}      
      </div>

    )
  }
}
