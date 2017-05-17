const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const addRouteFunction = require('./componentParser/addRouteFunction');
const addComponentFunction = require('./componentParser/addComponentFunction');

const PORT = 3333;

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
  res.sendFile(path.join(__dirname, '/romeIndex.html'));
})

app.post('/addroute', (req, res, next) => {
  addRouteFunction.addRouteAndLink(req.body.node, req.body.route, true, req.body.componentToRender, req.body.filePathObj, req.body.entry, next);
  res.status(200).end();
})

app.post('/addCompo', (req, res, next) => {
  addComponentFunction.writeChildComponent(req.body.componentName, req.body.node, req.body.filePathObj, next);
  res.status(200).end();
})

app.use(express.static(path.join(__dirname, '/')));


app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
