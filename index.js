var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();
const PORT = 3000;
var url = 'https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=malaria( FIRST_PDATE:[2013-01-01 TO 2013-12-31])&format=json&synonym=true&pageSize=20&sort=CITED desc';



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
	request(url, function(err, response, body){
		if(!err && response.statusCode == 200){
			var data = JSON.parse(body);
			var malaria= []
			data.resultList.result.forEach(function(Result) {
  				malaria.push({Title: Result.title, Author: Result.authorString, Year: Result.pubYear, Count: Result.citedByCount});  				
			});
			res.status(200).json(malaria);
		} else {
			res.status(500).json({
				content:'Api request failed'
			})
		}
	})

}




