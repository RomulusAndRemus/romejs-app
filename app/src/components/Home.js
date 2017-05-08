import React, { Component } from 'react';
import { BrowserRouter as Router, NavLink, Redirect} from 'react-router-dom';
import { connect } from 'react-redux';
import * as graphActions from '../actions/graphActions';
import { dialog, remote } from  'electron';
import componentParser from './../../componentParser/componentParser.js';
import path from 'path';
import fs from 'fs';

class Home extends Component {
  constructor(props){
    super(props);
  }

  openFile() {
    let componentData;
    remote.dialog.showOpenDialog({ properties: [ 'openFile'], filters: [{ name: 'JavaScript', extensions: ['js', 'jsx'] }]}, (file) => {
      componentData = componentParser.ASTParser(file[0]);
      this.props.createGraph(componentData);
      fs.writeFileSync('app/js/graph.js', 'const data = ' + JSON.stringify(componentData, null, 2));
      this.props.history.push('/graph');
    });
  }
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
                              React Router Visualizer
                          </h1>
                      </div>
                  </div>
                  <div className="jumbotron">
                      <h1>Welcome to RomeJS</h1>
                      <p>Let's get started! Please select the entry point of your React application. This is file that contains your Router opening element.</p>
                      <p><a id="open-file" className="btn btn-primary btn-lg" role="button" onClick={e => {
                        e.preventDefault();
                        this.openFile();
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

const mapStateToProps = (state, ownProps) => {
  return {
    components: state.components
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    createGraph: (data) => dispatch(graphActions.createGraph(data))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);