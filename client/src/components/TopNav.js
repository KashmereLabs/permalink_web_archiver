import React, { Component } from 'react';
import { Navbar } from 'react-bootstrap';

export default class TopNav extends Component {
  render() {
    return (
      <div className="app-top-nav-container">
        <Navbar bg="light" expand="lg" className="app-top-nav">
          <Navbar.Brand href="#home">Permalink Web Archiver</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
          </Navbar.Collapse>
        </Navbar>
      </div>
    )
  }
}
