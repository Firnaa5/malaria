var axios = require('axios');
var reqUrl ='https://www.ebi.ac.uk/europepmc/webservices/rest/search';
var format = require('./utils');

exports.getWithYear = function (req, res){	
	//End Date Func
	var date = new Date();
	var end = format.date;
	const params = {
		query: req.query.query,
		date:`( FIRST_PDATE:[${req.query.start || req.start} TO ${req.query.end || end}])`,
		sort: 'CITED desc',
		pageSize:10,
		synonym: true,
		format: 'json' 
	}
	axios.get(reqUrl,{ params: params})
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
			res.status(200).json(rest); 
		}		
	})
	.catch(function(err){
		res.status(500).json({
		 	content:'Api request failed'
		})	
	})
}


// middleware to get date for API call
exports.startDate = function(req,res,next){
	const params = {
		query: req.query.query,
		sort: 'P_PDATE_D asc',
		pageSize:1,
		synonym: true,
		format: 'json'  
	}
	axios.get(reqUrl,{ params: params})
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