// an http proxy that takes the url and makes a request to that url and returns the response
// this is used to get around the CORS issue

const express = require('express');
const request = require('request');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  const url = req.query.url;
  request(url, (error, response, body) => {
    if (error) {
      console.log(error);
    }
    res.send(body);
  });
});