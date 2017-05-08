import React from 'react';
import { BrowserRouter as Router, NavLink } from 'react-router-dom';

const Blank = () => {
  return (
    <div className="page-wrapper">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
            <h1 className="page-header" style={{color: "#ccc"}}>Blank Page  <small>Subheading</small>
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Blank;