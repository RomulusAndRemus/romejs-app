import React, {Component} from 'react';
import { BrowserRouter as Router, NavLink } from 'react-router-dom';

class Blank extends Component {
  componentDidMount() {
    setTimeout(() => {this.props.history.push('/editor')}, 50);
  }
  render() {
    return (
      <div className="page-wrapper">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Blank;