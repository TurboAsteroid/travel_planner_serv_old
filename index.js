#!/usr/bin/env node
let app = require('./app');
let debug = require('debug')('alertnotification:server');
let http = require('http');
let fs = require('fs');
let express = require('express');
let helper = require('./routes/helper');
var config = require('./config');

const mysql = require('mysql2/promise');



const server = http.createServer(app);
server.listen(3001, () => {
  console.log('HTTPS Server running on port 3001');
});