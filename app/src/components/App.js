import React  from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import path from 'path';
import Nav from './Nav';
import Home from './Home';
import Dashboard from './Dashboard';
import Blank from './Blank';
import Graph from './Graph';

let index;
if (window.location.pathname.includes('/index.html')) index = window.location.pathname;

const App = () => {
  return (
    <Router>
      <div id="wrapper">
        <Nav />
        <Route exact path={index} component={Home}/>
        <Route path="/home" component={Home}/>
        <Route path="/graph" component={Graph}/>
        <Route path="/dashboard" component={Dashboard}/>
        <Route path="/blank" component={Blank}/>
      </div>
    </Router>
  );
};

export default App;