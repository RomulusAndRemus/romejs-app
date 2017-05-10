const express = require('express');
const app = express();
const path = require('path');

const PORT = 3000;

// allow CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    next();
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/app/romeIndex.html'));
})

app.use(express.static(path.join(__dirname, '/app')));


app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
