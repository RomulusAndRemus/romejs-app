import React, {Component} from 'react';
import { ipcRenderer } from 'electron';
import path from 'path';

class Graph extends Component {
  render() {
    return (
      <div className="page-wrapper">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <webview src='http://localhost:3333' style={{height: "94.25vh"}}></webview>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Graph;
