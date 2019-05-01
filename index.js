var express = require('express');
var bodyParser = require('body-parser');
var app = express();
const {startDate, getWithYear} = require('./malaria');
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res){
	res.send(`The Europe PMC Api is running @ ${PORT}`);
})

app.listen(PORT, function(req, res){
	console.log(`Server is running @ ${PORT}`);
})

//API Call to get Data
app.get('/getWithYear', [startDate, getWithYear]);


