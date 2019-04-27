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

//End Date Func
var date = new Date();
var end = format(date);

// middleware to get date
var startDate = function(req,res,next){
	axios.get(reqUrl,{ params:{
		query: req.query.query,
		sort: 'P_PDATE_D asc',
		pageSize:1,
		synonym: true,
		format: 'json'  }})
	.then(function(response){
		 req.start = response.data.resultList.result[0].firstPublicationDate;
		 next();		
	})
	.catch(function(err){
	 	res.status(500).json({
		 	content:'Api request failed'
		})	
	})
}
app.use(startDate);
app.get('/getWithYear', malaria);

function malaria(req, res){	
	axios.get(reqUrl,{ params:{query: req.query.query,
		date:`( FIRST_PDATE:[${req.query.start || req.start} TO ${req.query.end || end}])`,
		sort: 'CITED desc',
		pageSize:10,
		synonym: true,
		format: 'json' }})
	.then(function(response){
		var rest = {};
		if(response && typeof response.data != 'undefined' && typeof response.data.resultList !='undefined' && response.data.resultList.result ) {
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
			console.log(response)	
			res.status(200).json(rest); 
		}		
	})
	.catch(function(err){
		res.status(500).json({
		 	content:'Api request failed'
		})	
	})
}
//date format function

function format(date) {
    var d = date.getDate();
    var m = date.getMonth() + 1;
    var y = date.getFullYear();
    return '' + y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
}