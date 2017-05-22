import React, {Component} from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { dialog, remote } from  'electron';
import Nav from './Nav';
import Home from './Home';
import Graph from './Graph';
import Editor from './Editor';
import Blank from './Blank';
import Redirect from './Redirect';
import componentParser from './../../componentParser/componentParser.js';
import server from './../../server.js';
import path from 'path';
import fs from 'fs';

let index;
if (window.location.pathname.includes('/index.html')) index = window.location.pathname;
index = decodeURI(index);
let cwd = index;
cwd = cwd.split('/');
cwd.pop();
cwd = cwd.join('/');

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      filename: null,
      filepath: null
    }
    this.openFile = this.openFile.bind(this);
    this.fileTree = this.fileTree.bind(this);
    this.selectedFile = this.selectedFile.bind(this);
    this.fileParser = this.fileParser.bind(this);
  }
  componentWillMount() {
    console.log('COMPONENT WILL MOUNT')
    server.startServer(cwd);
  }
  openFile(callback) {
    remote.dialog.showOpenDialog({ properties: [ 'openFile'], filters: [{ name: 'JavaScript', extensions: ['js', 'jsx'] }]}, (file) => {
      if (file.length) {
        this.fileParser(file[0]);
        let filename = file[0];
        let filepath = filename.split('/');
        filepath.pop();
        filepath = filepath.join('/');
        this.setState({
          filename: filename,
          filepath: filepath
        })
        callback();
      }
    });
  }

  fileParser(file) {
    let componentData;
    componentData = componentParser.ASTParser(file);
    $.post('http://localhost:3333/graphdata', { componentData: componentData});
  }

  fileTree(filename) {
    const info = {
      text: path.basename(filename),
      color: "#9d9d9d"
    }
    if (fs.lstatSync(filename).isDirectory()) {
      info.nodes = fs.readdirSync(filename).map(child => this.fileTree(`${filename}/${child}`));
    }
    return info;
  }

  selectedFile(file) {
    this.setState({
      filename: this.state.filepath + '/' + file
    })
  }

  render() {
    return (
      <Router>
        <div id="wrapper">
          <Route render={(props) => (
            <Nav {...props} fileTree={this.fileTree} filename={this.state.filename} filepath={this.state.filepath} selectedFile={this.selectedFile} fileParser={this.fileParser} />
          )}/>
          <Route exact path={index} render={(props) => (
            <Home {...props} openFile={this.openFile} />
          )}/>
          <Route path="/home" render={(props) => (
            <Home {...props} openFile={this.openFile} />
          )}/>
          <Route path="/graph" render={(props) => (
            <Graph {...props} />
          )}/>
          <Route path="/editor" render={(props) => (
            <Editor {...props} index={index} filename={this.state.filename} />
          )}/>
          <Route path="/blank" render={(props) => (
            <Blank {...props} />
          )}/>
          <Route path="/redirect" render={(props) => (
            <Redirect {...props} />
          )}/>
        </div>
      </Router>
    );
  }
};

export default App;