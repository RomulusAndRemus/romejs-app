import React, {Component} from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';

class Nav extends Component {

  constructor(props) {
    super(props);
    this.clickHandler = this.clickHandler.bind(this);
  }

  componentWillReceiveProps() {
    if (this.props.filename) {
      $('#tree').treeview({data: [this.props.fileTree(this.props.filepath)]});
    }
  }

  clickHandler() {
    this.props.fileParser(this.props.filename);
  }
  render() {
    
      let props = this.props;
      console.log('listener added');
      $('.node-tree').on('click', function(e) {
        e.preventDefault();
        if ($(this)[0].innerText.includes('.')) {
          props.history.push('/blank');
          props.selectedFile($(this)[0].innerText);
        }
      });

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
              <Link to="/editor"><i className="fa fa-fw fa-pencil-square-o"></i> Code Editor</Link>
            </li>
            <li>
              <a href="javascript:;" data-toggle="collapse" data-target="#explorer"><i className="fa fa-fw fa-share-alt"></i> File Explorer <i className="fa fa-fw fa-caret-down"></i></a>
              <ul id="explorer" className="collapse">
                <div id="tree"></div>
              </ul>
            </li>
            <li>
              <Link to="/redirect" onClick={this.clickHandler}><i className="fa fa-fw fa-refresh"></i> Refresh</Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default Nav;
