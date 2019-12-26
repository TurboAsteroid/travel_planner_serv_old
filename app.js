var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var app = express();
var config = require('./config');

app.use(cors({origin: '*'}));
app.use((req, res, next) => {
    res.removeHeader("X-Powered-By");
    next();
});

app.use(express.json()); // it is body-parser
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

let router = express.Router();
require('./routes/api')(app, config, router);
require('./routes/file')(app, config, router);

app.use(router);
module.exports = app;
