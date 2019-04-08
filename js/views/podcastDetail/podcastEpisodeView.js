var PodcastEpisodeView =  Backbone.View.extend({
	el : '#podcastContent',

	_template: null,     // Plantilla 
	_getTemplate: null,  // Metodo para obtener la plantilla
	_templatePath: null, // url de la plantilla

	_episodeModel: null, // modelo de episodio

	/**
	 * Eventos
	 */
	events : {
		
	},

	initialize : function (options){
		this._getTemplate = options.getTemplate;
		this._templatePath = options.templatePath;
		this._template = this._getTemplate('podcastEpisodeView', this._templatePath);
	},

	/**
	* Render de la pantalla
	*/
	render : function(episodeModel){
		this._episodeModel = episodeModel;

		this.$el.html('');
    	this.$el.html(this._template({
    		title : this._episodeModel.get('title'),
    		description : this._episodeModel.get('description'),
    		media : this._episodeModel.get('media'),
    		mediaType : this._episodeModel.get('mediaType')
    	}));
	}


});