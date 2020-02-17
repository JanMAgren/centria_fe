const http = require('http');
var express = require('express'),
    app = express();

var https = require('https');

const hostname = 'localhost';
const port = 3000;

const path = require('path');
const router = express.Router();

app.use('/styles', express.static('styles'))
app.set('view engine', 'pug')

router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
  //__dirname : It will resolve to your project folder.
});

//add the router
app.use('/', router);
app.listen(process.env.port || 6700);

console.log('Running at Port 6700');
