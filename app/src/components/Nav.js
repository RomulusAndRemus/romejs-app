import React from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';

const Nav = () => {
  return (
    <nav className="navbar navbar-inverse navbar-fixed-top" role="navigation">
      <div className="navbar-header">
        <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
          <span className="sr-only">Toggle navigation</span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
        </button>
        <Link to="/home" className="navbar-brand"><i className="fa fa-fw fa-university"></i> RomeJS</Link>
      </div>
      <div className="collapse navbar-collapse navbar-ex1-collapse">
        <ul className="nav navbar-nav side-nav">
          <li><Link to="/graph"><i className="fa fa-fw fa-sitemap"></i> Route Tree</Link>
          </li>
          <li>
            <a href="javascript:;" data-toggle="collapse" data-target="#demo"><i className="fa fa-fw fa-share-alt"></i> SEO Tools <i className="fa fa-fw fa-caret-down"></i></a>
            <ul id="demo" className="collapse">
              <li>
                <a href="#">Sitemap Generator</a>
              </li>
              <li>
                <a href="#">Dropdown Item</a>
              </li>
            </ul>
          </li>
          <li>
            <Link to="/blank"><i className="fa fa-fw fa-file"></i> Support</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Nav;