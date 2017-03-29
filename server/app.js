const express = require("express");
const exphbs = require('express-handlebars');
const http = require("http");
const path = require("path");
const morgan = require("morgan");
const routes = require("../client/js/routes.js");

const port = 8080;
const app = express();
app.use(express.static(path.join(__dirname, "../client")));

const hbs = exphbs.create({
  helpers: {},
  defaultLayout: "main"
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use("/", routes);

const server = http.createServer(app).listen(port, function() {
  console.log("Express started on https://localhost:" + port);
  console.log("Press Ctrl-C to terminate...");
});
