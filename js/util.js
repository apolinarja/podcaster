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