var request = require('request');
var cheerio = require('cheerio');
var readline = require('readline');
var http = require('https');
var fs = require('fs');


var loginUrl = "https://autentica.cpd.ua.es/cas/login?service=https://cvnet.cpd.ua.es/uaMatDocente/Materiales/MaterialesAlumno";
var matDocentes = "https://cvnet.cpd.ua.es/uamatdocente/Materiales/CursoMaterialesTodos";
var FILE = 'https://cvnet.cpd.ua.es/uamatdocente/Materiales/File?idMat='  ;

var items = [];
items.push("");


// set some defaults
var j = request.jar()

req = request.defaults({
	jar: j,                 // save cookies to jar
	rejectUnauthorized: false, 
	followAllRedirects: true   // allow redirections
});
 




 
 module.exports = {


sync: function(){
		console.log("[!]Lets start syncing");
		getMateriales(-1,-1,items);
		//scanMat(items);
},


login: function(username, password){
	var executionCode; 
	request(loginUrl, function (error, response, body) {
		//console.log('error:', error); // Print the error if one occurred
		//console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
		//console.log('body:', body); // Print the HTML for the Google homepage.
		var $ = cheerio.load(body);
		executionCode = $('[name="execution"]').attr('value') ; // some_name
		
		req.post({
			url: loginUrl,
			form: { 'username': username, 'password': password, '_eventId': 'submit', 'execution': executionCode  },
				
			headers: {
				'User-Agent': 'Super Cool Browser' // optional headers
			 }
		  }, function(err, resp, body) {
			
			//getMateriales(-1);

		});

		console.log("logged[!]");

	});
		console.log("login...: ");
},

getMateriales: function(idmat,codasi,itemsPack = items){	
	var payload = {
		'idmat': idmat, 
        'codasi': codasi, 
        'expresion': '',
        'direccion' : '',
        'filtro' : ''
		};
	
	
		req.post({
		url: matDocentes,
		form: payload,
			
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			'User-Agent': 'Super Cool Browser' // optional headers
		 }
	  }, function(err, resp, body) {
		
		// load the html into cheerio
		var $ = cheerio.load(body);
		
		//console.log($.html());
		
		$('.fila').each(function(i, elm) { //data-codasi
		
		var name = $(this).children('.columna5aux, .columna5').text();
		var isFolder = $(this).hasClass( "carpeta" );

			itemsPack.push({
				'isFolder' : isFolder,
				'datacodasi' : $(this).attr("data-codasi"),
				'dataid' : $(this).attr("data-id"),
				'name' : name
				
				
			});
			
			console.log(name) // for testing do text() 
			console.log(isFolder) // for testing do text() 

			console.log( $(this).attr("data-codasi")) // for testing do text() 
			//console.log( $(this).attr("data-codasi")) // for testing do text() 


		});

		printitems(itemsPack);
		 module.exports.scanMat(itemsPack)
		});	
},


scanMat: function(itemsPack){	

	for (var i = 1; i < itemsPack.length; i++) {
		
		if(itemsPack[i].isFolder){
			var rute = itemsPack[0] + itemsPack[i].name + '/';
			var dir = './files/' + rute;

			if (!fs.existsSync(dir)){
				fs.mkdirSync(dir);
			}

			//recurisve SCAN inside folder
			var newitemsPack = [];
			newitemsPack.push(rute);
			 module.exports.getMateriales(itemsPack[i].dataid,itemsPack[i].datacodasi,newitemsPack )
		}else{ // download File


		var filename = './files/' +  itemsPack[0] + itemsPack[i].name;


	var payload = {

		};

		req.post({
		url: FILE+itemsPack[i].dataid,
		form: payload,
			
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			'User-Agent': 'Super Cool Browser' // optional headers
		 }
	  }, function(err, resp, data) {
		


	
		})    .on('error', function(err) {
        // error handling
    })
    .on('finish', function(err) {
        // request is finished
    })
    .pipe(fs.createWriteStream(filename));

   


		}
	}

}

};






function printitems(itemsPack){
	console.log("----- printitems -------");

	for (var i = 0; i < itemsPack.length; i++) {
		
		console.log(itemsPack[i]);
	}
	
}



