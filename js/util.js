/**
* Muestra u oculta el spiner principal de la app
*/
function loadingIcon(show){
	show ? $('#loading-component').show() : $('#loading-component').hide(); 
};

/**
* recibe la url a invocar y la funcion success bindeada para que retorne
* a la vista que generó la llamada 
*/
function getCall(options){
	var url = options.url,
    params = {
        method: 'GET', 
        mode: 'cors', 
        redirect: 'follow'
    };     
 
	var request = new Request( url, params );

	fetch(request).then( function(response){ options.thenFunc(response.json())}).catch(function() {
        console.log("error fetch");
    });
};

/**
* Realiza una llamada AJAX. recibe la url y la funcion callback de succes
*/
function getAJAXCall(options){
	return $.ajax({
	    async : false,
	    cache : false,
	    type: 'GET',
		dataType: 'jsonp',
		cors: true ,
		contentType:'application/json',
	    url : options.url,
	    success : options.thenFunc,
	    error : function(){console.error("ajax error")}
	});
};

/**
* Llamada fetc para los datos atraves de un cliente cors
*/
function getCORSCall(options){
	fetch(CONSTANTS.GET_CORS_URL + options.feed)
	.then(function(response) {
		return response.text();
	})
	.then(function(myJson) {
		options.thenFunc(myJson);
	});
};

/**
* Parsea la fecha en el formato adecuado 
*/
function convertDate (date){
	return date ? [date.getDate(), date.getMonth()+1, date.getFullYear()].join('/') : '';
}