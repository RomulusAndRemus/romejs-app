import React, { Component } from 'react';
import { BrowserRouter as Router, NavLink } from 'react-router-dom';

class Editor extends Component {
  constructor(props) {
    super(props);
  }

  editor(filename) {
    let amdRequire = global.require('monaco-editor/min/vs/loader.js').require;
    let path = require('path');
    let fs = require('fs');
    let cwd = this.props.index;
    cwd = cwd.split('/');
    cwd.pop();
    cwd.pop();
    cwd = cwd.join('/');
    function uriFromPath(_path) {
      let pathName = path.resolve(_path).replace(/\\/g, '/');
      if (pathName.length > 0 && pathName.charAt(0) !== '/') {
        pathName = '/' + pathName;
      }
      return encodeURI('file://' + cwd + pathName);
    }
    // 
    amdRequire.config({
      baseUrl: uriFromPath(path.resolve(__dirname, '../node_modules/monaco-editor/min'))
    });
    // workaround monaco-css not understanding the environment
    self.module = undefined;
    // workaround monaco-typescript not understanding the environment
    self.process.browser = true;
    let editor;
    amdRequire(['vs/editor/editor.main'], () => {
      editor = monaco.editor.create(document.getElementById('container'), {
        value: fs.readFileSync(filename, { encoding: 'utf8' }),
        language: 'javascript',
        theme: "vs-dark",
      });
    });
  }

  componentDidMount() {
    this.editor(this.props.filename);
  }
  render() {
    return (
      <div className="page-wrapper">
        <div className="container-fluid" id="container" style={{ height: "100%", width: "100%" }}>
        </div>
      </div>
      
    );
  }
}

export default Editor;