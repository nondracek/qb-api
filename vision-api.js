var cool = require('cool-ascii-faces');
const express = require('express');

// Initialize http server
const app = express();

app.set('port', (process.env.PORT || 5000));

// Use router for all API endpoints
// app.use('/', router);

app.get('/', function(request, response) {
  response.send(cool());
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
