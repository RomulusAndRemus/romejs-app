import React, { Component } from 'react';
import { BrowserRouter as Router, NavLink, Redirect} from 'react-router-dom';
import { dialog, remote } from  'electron';
import componentParser from './../../componentParser/componentParser.js';

class Home extends Component {
  
  render() {
    return (
      <div className="page-wrapper" className="home-page">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="panel panel-default" id="home">
                <div className="panel-body home-page">

                  <div className="row">
                      <div className="col-lg-12">
                          <h1 className="page-header" style={{color: "#ccc"}}>
                              A Visualized IDE for Your React Application.
                          </h1>
                      </div>
                  </div>
                  <div className="jumbotron">
                      <h1>Welcome to RomeJS.</h1>
                      <p>Let's get started! Please select the entry point of your React application. This is the file which renders your root component (e.g. "App.js"; "Index.js"). </p>
                      <p><a id="open-file" className="btn btn-primary btn-lg" role="button" data-loading-text="<i class='fa fa-spinner fa-spin '></i> Processing File" onClick={e => {
                        e.preventDefault();
                        let self = this;

                        const openPromiseGen = () => new Promise((resolve, reject) => {
                          this.props.openFile(resolve);
                        });

                        (async function openThis() {
                          await openPromiseGen();
                          let $this = $('#open-file');
                          let props = self.props;
                          $this.button('loading');
                            setTimeout(function() {
                              $this.button('reset');
                              props.history.push('/graph');
                          }, 50);
                        })()

                        }}>Open file &raquo;</a>
                      </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;