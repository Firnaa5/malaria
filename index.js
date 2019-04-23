var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();
const PORT = 3000;
var reqUrl ='https://www.ebi.ac.uk/europepmc/webservices/rest/search';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res){
	res.send(`The Europe PMC Api is running @ ${PORT}`);
})

app.listen(PORT, function(req, res){
	console.log(`Server is running @ ${PORT}`);
})

app.get('/getWithYear', malaria);

function malaria(req, res){
		var options ={
			query: req.query.query,
			date:`( FIRST_PDATE:[${req.query.start} TO ${req.query.end}])`,
			sort:'CITED desc',
			pageSize:100,
			synonym: true,
			format: 'json'
		}
		var rest ={};
		request({url:reqUrl, qs:options }, function(err, response, body){
			console.log(options)
		if(!err && response.statusCode == 200){
			var data = JSON.parse(body);
				data.resultList.result.forEach(function(result) {
					var key = result.pubYear;
					var responseData = {title: result.title, author: result.authorString, pubYear: result.pubYear, count: result.citedByCount};
  					if(rest.hasOwnProperty(key)){
  						rest[key].push(responseData);
  					} else {
					rest[key] =[];
  					rest[key].push(responseData);
  				}
  					console.log(responseData) 				
			});
			res.status(200).json(rest);			
		} else {
			res.status(500).json({
				content:'Api request failed'
			})
		}
	})

}




