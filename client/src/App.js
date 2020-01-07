import React from 'react';
import logo from './logo.svg';
import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import Landing from './components/Landing';
import TopNav from './components/TopNav';

function App() {
  return (
    <div className="App">
      <TopNav/>
      <Landing/>
    </div>
  );
}

export default App;
