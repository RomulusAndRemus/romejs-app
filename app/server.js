(function () {
  const express = require('express');
  const app = express();
  const fs = require('fs');
  const path = require('path');
  const bodyParser = require('body-parser');
  const addRouteFunction = require('./componentParser/addRouteFunction');
  const addComponentFunction = require('./componentParser/addComponentFunction');
  const { ipcRenderer, remote } = require('electron');

  const PORT = 3333;

  function startServer(cwd) {
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    // allow CORS
    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
      next();
    });

    app.get('/', (req, res) => {
      res.sendFile(cwd + '/romeIndex.html');
    })

    app.post('/graphdata', (req, res, next) => {
      fs.writeFileSync(cwd + '/assets/js/graph.js', 'const data = ' + JSON.stringify(req.body.componentData, null, 2))
      res.status(200).end();
    })

    app.post('/addroute', (req, res, next) => {
      addRouteFunction.addRouteAndLink(req.body.node, req.body.route, true, req.body.componentToRender, req.body.filePathObj, req.body.entry, next);
    }, (req, res) => {
      ipcRenderer.send('reload', function () {
      });
      res.status(200).end();
    })

    app.post('/addCompo', (req, res, next) => {
      addComponentFunction.writeChildComponent(req.body.componentName, req.body.node, req.body.filePathObj, cwd, req.body.entry, next);
    }, (req, res) => {
      ipcRenderer.send('reload', function () {
      });
      res.status(200).end();
    })

    app.use(express.static(cwd + '/'));


    app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
  }
  exports.startServer = startServer;
})();