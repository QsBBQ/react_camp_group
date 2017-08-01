import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Camper from './Camper';
import Group from './Group';
// const Camper = (props) => <h1>Camper component</h1>
// const Group = (props) => <h1>Group component</h1>
const Home = (props) => <h1>HOME!! component</h1>

const CamperItem = (props) => <h1>Camper: {props.match.params.id}</h1>



ReactDOM.render((
  <Router>
    <App>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/camper" component={Camper} />
        <Route exact path="/camper/:id" component={CamperItem} />
        <Route exact path="/group" component={Group} />
      </Switch>
    </App>
  </Router>
), document.getElementById('root'));
registerServiceWorker();
