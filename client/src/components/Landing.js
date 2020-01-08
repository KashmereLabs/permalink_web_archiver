import React, { Component } from 'react';
import { Form, Button, Container, Row, Col, Badge, Alert } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment'
const APP_SERVER_URI = process.env.REACT_APP_API_URI;

export default class Landing extends Component {

  constructor(props) {
    super(props);
    this.state = {
      "inputURI": "",
      "transactionStatus": "init",
      "transactionId": "",
      recentArchives: [],
      "articleFormatting": true,
      "showSummary": true,
      "showArchiveButton": false
    };
  }

  componentWillMount() {
    const self = this;
    axios.get(`${APP_SERVER_URI}/storage/recent_archives`).then(function(dataResponse) {
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

      let publish_date = moment(previewData.publish_date).format('ll');

      self.setState({
        "linkPreview": Object.assign({}, previewData, { sentiment_text: sentiment_text, publish_date: publish_date }),
        "transactionStatus": "init",
        "transactionId": "",
        "showArchiveButton": true
      });
    });
  }

  inputURIChanged = (evt) => {
    this.setState({ inputURI: evt.target.value });
  }

  archiveLink = () => {
    const { linkPreview, articleFormatting, showSummary } = this.state;
    const payload = Object.assign({}, linkPreview, {
      "summary": linkPreview.summary,
      "full_text": linkPreview.full_text,
      "article_formatting": articleFormatting,
      "show_summary": showSummary
    });

    const self = this;
    this.setState({ "transactionStatus": "loading" });

    axios.post(`${APP_SERVER_URI}/storage/archive`, { "linkData": payload }).then(function(archiveResponse) {

      if (archiveResponse.data.message === 'success') {
        self.setState({ "transactionId": archiveResponse.data.id, "transactionStatus": "pending", "showArchiveButton": false }, function() {
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

  articleFormattingToggle = () => {
    let newCheckVal = !this.state.articleFormatting;
    this.setState({ articleFormatting: newCheckVal });
  }

  showSummaryToggle = () => {
    let newCheckVal = !this.state.showSummary;
    this.setState({ showSummary: newCheckVal });

  }

  render() {
    const { inputURI, linkPreview, transactionStatus, transactionId, recentArchives, articleFormatting, showSummary, showArchiveButton } = this.state;
    let textPreviewView = <span/>;
    if (linkPreview) {
      textPreviewView = <LinkDataPreview previewData={linkPreview} articleFormatting={articleFormatting} showSummary={showSummary}/>
    }

    let archiveButton = <span/>;
    if (linkPreview && showArchiveButton) {
      archiveButton =
        <div className="archive-button-container">
        <Form.Check type="checkbox" label="Keep article formatting" checked={articleFormatting} onChange={this.articleFormattingToggle}/>
        <Form.Check type="checkbox" label="Show Article summary" checked={showSummary} onChange={this.showSummaryToggle}/>
        <Button onClick={this.archiveLink} className="app-button archive-button">Archive Link</Button>
      </div>
    }

    let currentAlert = <Alert  variant="info" className="app-alert-bar">
                         Please make sure that you do not archive links with copyrighted content or images.
                       </Alert>;
    if (linkPreview && transactionStatus === 'init') {
      currentAlert = <Alert variant="primary" className="app-alert-bar">Your document is now ready to be archived</Alert>
    }
    if (linkPreview && transactionStatus === 'pending') {
      currentAlert = <Alert variant="info">
      <div className="lds-dual-ring"></div>
      <div className="loading-preview-text">
        Your transaction has been broadcast and is currently pending.
        <div>
        When confirmed the archived file will be available at&nbsp; 
          <a href={`https://arweave.net/${transactionId}`}
              target="_blank">https://arweave.net/{transactionId}</a>
        </div>
      </div>
      </Alert>
    }
    if (linkPreview && transactionStatus === 'confirmed') {
      currentAlert = <Alert variant="success">
      <div>Your transaction has been successfully confirmed. </div>
      <div>You can view your archived page at <a href={`https://arweave.net/${transactionId}`} target="_blank">https://arweave.net/{transactionId}</a></div>
      </Alert>
    }
    if (transactionStatus === 'loading') {
      currentAlert = <Alert variant="info">
        <div className="lds-dual-ring"></div>
        <div className="loading-preview-text">Please wait</div>
      </Alert>
    }
    let recentArchiveView = <div className="recent-archives-loading-container"><div className="lds-dual-ring"></div></div>;
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
          </Form>
          </div>
          <div>
          {currentAlert}
          </div>
          {archiveButton}
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
    const { previewData, showSummary, articleFormatting } = this.props;

    let keywordList = <span/>;
    if (previewData.keywords) {
      keywordList = <div>{previewData.keywords.map(function(keyword, idx){
        return <Badge pill variant="light" key={`${keyword}-${idx}`}>{keyword}</Badge>
      })}</div>
    }

    function createMarkup() {
      if (articleFormatting) {
        return { __html: previewData.full_text.replace(/\n/g, "<br />") };
      }
      else {
        return { __html: previewData.full_text };
      }
    }
    let summaryText = <span/>;
    if (showSummary) {
      summaryText =
        <div>
        <div className="h4">Summary</div>
        <div>{previewData.summary}</div>
      </div>
    }

    let currentImage = "";
    if (previewData.image) {
      currentImage = previewData.image;
    }
    else {
      currentImage = "https://loremflickr.com/640/360";
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
          <Col lg={6}><img src={currentImage} className="preview-image-class"/></Col>
          <Col lg={6}>
            {summaryText}
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
    let archiveList = archiveData.map((item, idx) => (<ArchiveCard key={idx} data={item}/>))
    return (
      <div>
        <div className="h4 container-heading">Recently archived links</div>
        {archiveList}      
      </div>
    )
  }
}


class ArchiveCard extends Component {
  openCardURL = () => {
    const { data } = this.props;
    var win = window.open(data.link, '_blank');
    win.focus();
  }
  render() {
    const { data } = this.props;
    let keywordList = [];
    if (data.keywords) {
      keywordList = JSON.parse(data.keywords);
    }
    if (keywordList.length > 12) {
      keywordList = keywordList.slice(0, 12);
    }
    let cardTitle = data.title.length < 70 ? data.title : data.title.substring(0, 70) + "...";

    let tagList = keywordList.map((key, idx) => (<Badge pill variant="light" key={`${key}-${idx}`}>{key}</Badge>));
    return (
      <div className="preview-card-container" onClick={this.openCardURL}>
        <Row>
          <Col lg={4}>
            <div className="preview-card-image-container">
              <img src={data.image} className="preview-card-image"/>
            </div>
          </Col>
          <Col lg={8}>
            <div className="h5 card-title">{cardTitle}</div>
            <div className="preview-card-meta-container">
              <div className="preview-card-meta-label">Author</div>
              <div className="preview-card-meta-value">{data.author}</div>
              <div className="preview-card-meta-label">Original published on</div>
              <div className="preview-card-meta-value">{data.published_on}</div>
            </div>
            <div>{tagList}</div>
          </Col>
        </Row>

      </div>
    )
  }
}
