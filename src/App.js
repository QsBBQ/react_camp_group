import React, { Component } from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import {
  Link
} from 'react-router-dom';
import './App.css';

// Fix Bug
// routing
// organization
// testing
// navbar and side navbar
// create, read, update camper, campers
// CRUD groups
// Add component or something for setting hidden columns
// look at remote
// How to ensure the data is fresh
// hmm delete multiple rows?
// name
// age
// balance
// paid
// awards

class App extends Component {

  render() {
    return (
      <div>
        <nav className="navbar navbar-default">
          <ul className="nav navbar-nav">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/camper">Camper</Link></li>
            <li><Link to="/group">Group</Link></li>
          </ul>
        </nav>

        {this.props.children}
      </div>

    );
  }
}

export default App;
