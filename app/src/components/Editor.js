import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import { BrowserRouter as Router, NavLink } from 'react-router-dom';
import path from 'path';
import fs from 'fs';

class Editor extends Component {

  editor(filename) {
    let amdRequire = global.require('monaco-editor/min/vs/loader.js').require;
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
    amdRequire(['vs/editor/editor.main'], () => {
      window.editor = monaco.editor.create(document.getElementById('container'), {
        value: fs.readFileSync(filename, { encoding: 'utf8' }),
        language: 'javascript',
        theme: "vs-dark",
      });
    });
  }

  save(filename) {
    let value = window.editor.getValue();
    // fs.writeFileSync(filename, value);
  }
  componentDidMount() {
    let self = this;
    this.editor(this.props.filename);
    ipcRenderer.on('save', () => {
      self.save(self.props.filename);
      self.props.history.push('/blank');
    });
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