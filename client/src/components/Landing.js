import React, { Component } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
const APP_SERVER_URI = process.env.REACT_APP_API_URI;

export default class Landing extends Component {

  constructor(props) {
    super(props);
    this.state = { "inputURI": "" };
  }

  submitURLForm = (e) => {
    e.preventDefault();
    const { inputURI } = this.state;

    const payload = { url: inputURI };
    const self = this;

    axios.post(`${APP_SERVER_URI}/link/extract`, payload).then(function(dataResponse) {
      self.setState({ "linkPreview": dataResponse.data.data });
    });
  }

  inputURIChanged = (evt) => {
    this.setState({ inputURI: evt.target.value });

    //console.log(val);
  }

  archiveLink = () => {
    const { linkPreview } = this.state;

    axios.post(`${APP_SERVER_URI}/storage/archive`, { "linkData": linkPreview }).then(function(archiveResponse) {
      console.log(archiveResponse);
    });
  }

  render() {
    const { inputURI, linkPreview } = this.state;
    let textPreviewView = <span/>;
    if (linkPreview) {
      textPreviewView = <LinkDataPreview previewData={linkPreview}/>
    }

    return (
      <Container>
      <Form onSubmit={this.submitURLForm}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="text" placeholder="Enter url" value={inputURI} onChange={this.inputURIChanged}/>

        </Form.Group>
        <Button type="submit">Submit</Button>
      </Form>
      <div>
        {textPreviewView}
      </div>
      <Button onClick={this.archiveLink}>Archive Link</Button>
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
      keywordList = <div>{previewData.keywords.map(function(keyword){
        return <div className="chip">{keyword}</div>
      })}</div>

    }
    return (
      <div>
        <h3>{previewData.title}</h3>
        <Row>
          <Col lg={6}><img src={previewData.image} className="preview-image-class"/></Col>
          <Col lg={6}>
            <div>{previewData.summary}</div>
            {keywordList}
          </Col>
        </Row>
        <Row>
        <div>
          {previewData.full_text}
        </div>
        </Row>
      </div>
    )
  }
}
