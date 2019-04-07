var PodcastItemView =  Backbone.View.extend({
	_template: null,     // Plantilla
	_getTemplate: null,  // Metodo para obtener la plantilla
	_templatePath: null, // url de la plantilla

	/**
	 * Eventos
	 */
	events : {
	},

	initialize : function (options){
		this._getTemplate = options.getTemplate;
		this._templatePath = options.templatePath;
		this._template = this._getTemplate('podcastItemView', this._templatePath);
	},

	/**
	*
	*/
	render : function(model){
		return this._template({
			id: model.get('id'),
			src: model.get('img'),
			alt: model.get('name'),
			name: model.get('name'),
			author: model.get('author')
		});
	}


});
