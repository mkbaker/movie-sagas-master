import React, { Component } from 'react';
import './App.css';

//components
import Header from '../Header/Header';

class App extends Component {
  // Renders the entire app on the DOM
  render() {
    return (
      <div className="App">
        <Header />
      </div>
    );
  }
}

export default App;
