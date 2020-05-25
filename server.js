var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.text({
  type: function(req) {
    return 'text';
  }
}));

app.post('/slack/events', function (req, res) {
    payload = JSON.parse(req.body)
    console.log(payload.challenge);
    res.send(payload.challenge);
});

http.createServer(app).listen(process.env.PORT || 3000);
