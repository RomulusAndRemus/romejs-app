import React from 'react';

const Dashboard = () => {
  return (
    <div className="page-wrapper">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
            <h1 className="page-header"> Dashboard <small>Statistics Overview</small></h1>
            <ol className="breadcrumb">
              <li className="active">
                <i className="fa fa-dashboard"></i> Dashboard
              </li>
            </ol>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-3 col-md-6">
            <div className="panel panel-primary">
              <div className="panel-heading">
                <div className="row">
                  <div className="col-xs-3">
                    <i className="fa fa-comments fa-5x"></i>
                  </div>
                  <div className="col-xs-9 text-right">
                    <div className="huge">26</div>
                    <div>New Comments!</div>
                  </div>
                </div>
              </div>
              <a href="#">
                <div className="panel-footer">
                  <span className="pull-left">View Details</span>
                  <span className="pull-right"><i className="fa fa-arrow-circle-right"></i></span>
                  <div className="clearfix"></div>
                </div>
              </a>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="panel panel-green">
              <div className="panel-heading">
                <div className="row">
                  <div className="col-xs-3">
                    <i className="fa fa-tasks fa-5x"></i>
                  </div>
                  <div className="col-xs-9 text-right">
                    <div className="huge">12</div>
                    <div>New Tasks!</div>
                  </div>
                </div>
              </div>
              <a href="#">
                <div className="panel-footer">
                  <span className="pull-left">View Details</span>
                  <span className="pull-right"><i className="fa fa-arrow-circle-right"></i></span>
                  <div className="clearfix"></div>
                </div>
              </a>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="panel panel-yellow">
              <div className="panel-heading">
                <div className="row">
                  <div className="col-xs-3">
                    <i className="fa fa-shopping-cart fa-5x"></i>
                  </div>
                  <div className="col-xs-9 text-right">
                    <div className="huge">124</div>
                    <div>New Orders!</div>
                  </div>
                </div>
              </div>
              <a href="#">
                <div className="panel-footer">
                  <span className="pull-left">View Details</span>
                  <span className="pull-right"><i className="fa fa-arrow-circle-right"></i></span>
                  <div className="clearfix"></div>
                </div>
              </a>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="panel panel-red">
              <div className="panel-heading">
                <div className="row">
                  <div className="col-xs-3">
                    <i className="fa fa-support fa-5x"></i>
                  </div>
                  <div className="col-xs-9 text-right">
                    <div className="huge">13</div>
                    <div>Support Tickets!</div>
                  </div>
                </div>
              </div>
              <a href="#">
                <div className="panel-footer">
                  <span className="pull-left">View Details</span>
                  <span className="pull-right"><i className="fa fa-arrow-circle-right"></i></span>
                  <div className="clearfix"></div>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title"><i className="fa fa-bar-chart-o fa-fw"></i> Area Chart</h3>
              </div>
              <div className="panel-body">
                <div id="morris-area-chart"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-4">
            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title"><i className="fa fa-long-arrow-right fa-fw"></i> Donut Chart</h3>
              </div>
              <div className="panel-body">
                <div id="morris-donut-chart"></div>
                <div className="text-right">
                  <a href="#">View Details <i className="fa fa-arrow-circle-right"></i></a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title"><i className="fa fa-clock-o fa-fw"></i> Tasks Panel</h3>
              </div>
              <div className="panel-body">
                <div className="list-group">
                  <a href="#" className="list-group-item">
                    <span className="badge">just now</span>
                    <i className="fa fa-fw fa-calendar"></i> Calendar updated
                  </a>
                  <a href="#" className="list-group-item">
                    <span className="badge">4 minutes ago</span>
                    <i className="fa fa-fw fa-comment"></i> Commented on a post
                  </a>
                  <a href="#" className="list-group-item">
                    <span className="badge">23 minutes ago</span>
                    <i className="fa fa-fw fa-truck"></i> Order 392 shipped
                  </a>
                  <a href="#" className="list-group-item">
                    <span className="badge">46 minutes ago</span>
                    <i className="fa fa-fw fa-money"></i> Invoice 653 has been paid
                  </a>
                  <a href="#" className="list-group-item">
                    <span className="badge">1 hour ago</span>
                    <i className="fa fa-fw fa-user"></i> A new user has been added
                  </a>
                  <a href="#" className="list-group-item">
                    <span className="badge">2 hours ago</span>
                    <i className="fa fa-fw fa-check"></i> Completed task: "pick up dry cleaning"
                  </a>
                  <a href="#" className="list-group-item">
                    <span className="badge">yesterday</span>
                    <i className="fa fa-fw fa-globe"></i> Saved the world
                  </a>
                  <a href="#" className="list-group-item">
                    <span className="badge">two days ago</span>
                    <i className="fa fa-fw fa-check"></i> Completed task: "fix error on sales page"
                  </a>
                </div>
                <div className="text-right">
                  <a href="#">View All Activity <i className="fa fa-arrow-circle-right"></i></a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title"><i className="fa fa-money fa-fw"></i> Transactions Panel</h3>
              </div>
              <div className="panel-body">
                <div className="table-responsive">
                  <table className="table table-bordered table-hover table-striped">
                    <thead>
                      <tr>
                        <th>Order #</th>
                        <th>Order Date</th>
                        <th>Order Time</th>
                        <th>Amount (USD)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>3326</td>
                        <td>10/21/2013</td>
                        <td>3:29 PM</td>
                        <td>$321.33</td>
                      </tr>
                      <tr>
                        <td>3325</td>
                        <td>10/21/2013</td>
                        <td>3:20 PM</td>
                        <td>$234.34</td>
                      </tr>
                      <tr>
                        <td>3324</td>
                        <td>10/21/2013</td>
                        <td>3:03 PM</td>
                        <td>$724.17</td>
                      </tr>
                      <tr>
                        <td>3323</td>
                        <td>10/21/2013</td>
                        <td>3:00 PM</td>
                        <td>$23.71</td>
                      </tr>
                      <tr>
                        <td>3322</td>
                        <td>10/21/2013</td>
                        <td>2:49 PM</td>
                        <td>$8345.23</td>
                      </tr>
                      <tr>
                        <td>3321</td>
                        <td>10/21/2013</td>
                        <td>2:23 PM</td>
                        <td>$245.12</td>
                      </tr>
                      <tr>
                        <td>3320</td>
                        <td>10/21/2013</td>
                        <td>2:15 PM</td>
                        <td>$5663.54</td>
                      </tr>
                      <tr>
                        <td>3319</td>
                        <td>10/21/2013</td>
                        <td>2:13 PM</td>
                        <td>$943.45</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="text-right">
                  <a href="#">View All Transactions <i className="fa fa-arrow-circle-right"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

  export default Dashboard;