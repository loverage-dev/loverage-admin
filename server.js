const express = require('express');
const basicAuth = require('basic-auth-connect');
const port = process.env.PORT || 8080;
const app = express();
var username = process.env.BASIC_AUTH_USERNAME;
var password = process.env.BASIC_AUTH_PASSWORD;

if (username && password) {
    app.use(basicAuth(username, password));
}else{
    app.use(basicAuth("love", "average"));
}

app.use(express.static(__dirname + "/dist/"));
app.listen(port);