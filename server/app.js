const express = require('express');
const exphbs = require('express-handlebars');
const http = require('http');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const routes = require('../client/js/routes.js');

const port = 8080;
const app = express();
app.use(express.static(path.join(__dirname, '../client')));

app.use(morgan('combined'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const hbs = exphbs.create({
  helpers: {},
  defaultLayout: 'main'
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use('/', routes);

http.createServer(app).listen(port, function () {
  console.log('Express started on https://localhost:' + port);
  console.log('Press Ctrl-C to terminate...');
});
