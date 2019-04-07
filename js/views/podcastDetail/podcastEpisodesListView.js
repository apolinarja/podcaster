var PodcastEpisodesListView =  Backbone.View.extend({
	el : '#podcastContent',

	_template: null,     // Plantilla del header
	_getTemplate: null,  // Metodo para obtener la plantilla
	_templatePath: null, // url de la plantilla

	_episodesCollection: null, // lista de episodios

	// Subvistas
	_podcastEpisodeRowView : null, // Vista de fila
	
	/**
	 * Eventos
	 */
	events : {
		
	},

	initialize : function (options){
		this._getTemplate = options.getTemplate;
		this._templatePath = options.templatePath;
		this._template = this._getTemplate('podcastEpisodesListView', this._templatePath);
	},

	/**
	* Render de la pantalla
	*/
	render : function(episodesCollection){
		this._episodesCollection = episodesCollection;
		
		var rows = this._generateEpisodesRow();

		this.$el.html('');
    	this.$el.html(this._template({
    		episodesNumber: this._episodesCollection.length,
    		rows : rows
    	}));
	},

	_generateEpisodesRow: function(){
		var rows = '';

		this._podcastEpisodeRowView = new PodcastEpisodeRowView({
			getTemplate : this._getTemplate,
			templatePath : this._templatePath
		});

		this._episodesCollection.each(function(episode){
			rows += this._podcastEpisodeRowView.render(episode);
		}, this);

		return rows;
	}
});