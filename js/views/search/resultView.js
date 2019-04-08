var ResultView =  Backbone.View.extend({
	el : '#podcastResultView',

	_template: null,     // Plantilla
	_getTemplate: null,  // Metodo para obtener la plantilla
	_templatePath: null, // url de la plantilla


	_collection: null, 	// coleccion a pintar
	_podcastItemView: null, //vista de cada elemento
	/**
	 * Eventos
	 */
	events : {
	},

	initialize : function (options){
		this._getTemplate = options.getTemplate;
		this._templatePath = options.templatePath;
		this._template = this._getTemplate('resultView', this._templatePath);
	},

	/**
	*
	*/
	render : function(options){
		this._collection = options.collection;
		var rows = this._generateListItems();

		this.$el.html('');
    	this.$el.html(this._template({
    		rows: rows
    	}));
	},
	/**
	* Coge la lista que hay almacenada en el localstorage. Esta guardado como json 
	* genera la coleccion y la recorre pasandosela para generar cada item de la lista
	*/
	_generateListItems : function(){
		this._podcastItemView = new PodcastItemView({
			getTemplate : this._getTemplate,
			templatePath: this._templatePath
		});

		var row = '';

		this._collection.each(function(model){
			row += this._podcastItemView.render(model);
		}, this);

		return row;
	},
});