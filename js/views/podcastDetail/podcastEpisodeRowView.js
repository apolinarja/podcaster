var PodcastEpisodeRowView =  Backbone.View.extend({

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
		this._template = this._getTemplate('podcastEpisodeRowView', this._templatePath);
	},

	/**
	* Render de la pantalla
	*/
	render : function(episodeModel){
		return this._template({
    		id: episodeModel.get('id'),
    		title : episodeModel.get('title'),
    		publishDate: convertDate(episodeModel.get('publishDate')),
    		duration: episodeModel.get('duration')
    	});
	}
});