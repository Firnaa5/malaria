var express = require('express');
var bodyParser = require('body-parser');
var axios = require('axios');
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
		axios.get(reqUrl,{ params:{query: req.query.query,
			date: `( FIRST_PDATE:[${req.query.start} TO ${req.query.end}])`,
			sort: 'CITED desc',
			pageSize:100,
			synonym: true,
			format: 'json' }})
		.then(function(response){
			var rest = {};
			const data = response.data.resultList.result;	
			data.forEach(function(result) {
				var key = result.pubYear;				
  				var responseData = {title: result.title, author: result.authorString, year: result.pubYear, count: result.citedByCount};
  				if(rest.hasOwnProperty(key)){
  					rest[key].push(responseData);
  				} else {
  					rest[key] = [];
  					rest[key].push(responseData);
  				}  	 			 				
			});	
			res.status(200).json(rest); 		
		})
		.catch(function(err){
			 res.status(500).json({
			 	content:'Api request failed'
			 })	
		})
	}




