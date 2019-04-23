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
			start: req.query.start,
			end: req.query.end,
			sort: 'CITED desc',
			pageSize:1,
			synonym: true,
			format: 'json' }})
		.then(function(response){
			const data = response.data.resultList.result;
			console.log(data);	
			data.forEach(function(result) {
  				var responseData = {Title: result.title, Author: result.authorString, Year: result.pubYear, Count: result.citedByCount};
  	 			res.write(JSON.stringify(responseData));  				
			});
			res.end();			
		})
		.catch(function(err){
			 res.status(500).json({
			 	content:'Api request failed'
			 })	
		})
	}
			



