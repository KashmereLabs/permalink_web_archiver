import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
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
    console.log(APP_SERVER_URI);
    console.log("GG");

    axios.post(`${APP_SERVER_URI}/link/extract`, payload).then(function(dataResponse) {
      console.log(dataResponse);
    });
  }

  inputURIChanged = (evt) => {
    this.setState({ inputURI: evt.target.value });

    //console.log(val);
  }

  render() {
    const { inputURI } = this.state;

    return (
      <div>
<Form onSubmit={this.submitURLForm}>
  <Form.Group controlId="formBasicEmail">
    <Form.Label>Email address</Form.Label>
    <Form.Control type="text" placeholder="Enter url" value={inputURI} onChange={this.inputURIChanged}/>
    <Form.Text className="text-muted">
      We'll never share your email with anyone else.
    </Form.Text>
  </Form.Group>
  <Button type="submit">Submit</Button>
  </Form>
  
      </div>
    )
  }
}
